-- H5 应用容器、应用页面元数据和应用级布局配置。
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 80),
  logo text, status text not null default 'draft' check (status in ('draft', 'published')),
  home_route_key text not null default 'home', theme_config jsonb not null default '{}'::jsonb,
  layout_config jsonb not null default '{"showTabbar":true,"tabbarPosition":"bottom","tabbarHeight":52,"backgroundColor":"#ffffff","activeColor":"#2563eb","inactiveColor":"#6b7280","safeArea":true,"items":[]}'::jsonb,
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, slug)
);
alter table public.apps drop constraint if exists apps_status_check;
alter table public.apps add constraint apps_status_check check (status in ('draft', 'published', 'offline'));
alter table public.apps enable row level security;
drop policy if exists "apps_all_own" on public.apps;
create policy "apps_all_own" on public.apps for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.apps to authenticated;

alter table public.pages add column if not exists app_id uuid references public.apps(id) on delete cascade;
alter table public.pages add column if not exists route_key text;
alter table public.pages add column if not exists page_type text check (page_type in ('home','profile','product-detail','article-detail','custom'));
alter table public.pages add column if not exists is_home boolean not null default false;
alter table public.pages add column if not exists show_in_tabbar boolean not null default false;
alter table public.pages add column if not exists sort int not null default 0;
create unique index if not exists uq_pages_app_route_key on public.pages(app_id, route_key) where app_id is not null and route_key is not null;
create unique index if not exists uq_pages_app_home on public.pages(app_id) where app_id is not null and is_home;
create index if not exists idx_pages_app on public.pages(app_id, sort);

insert into public.apps(user_id, name, slug)
select distinct p.user_id, '默认 H5 应用', 'default-app-' || left(replace(p.user_id::text, '-', ''), 12)
from public.pages p where p.app_id is null on conflict (user_id, slug) do nothing;
update public.pages p set app_id = a.id, route_key = coalesce(nullif(p.schema->>'routeKey',''), 'page-' || left(replace(p.id::text,'-',''), 8)), page_type = coalesce(p.schema->>'pageType','custom')
from public.apps a where a.user_id = p.user_id and p.app_id is null;

-- 应用配置也需要不可变的公开快照，避免草稿导航和主题直接暴露到线上。
create table if not exists public.app_revisions (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  config jsonb not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
create index if not exists idx_app_revisions_app_created on public.app_revisions(app_id, created_at desc);
alter table public.app_revisions enable row level security;
drop policy if exists "app_revisions_select_own" on public.app_revisions;
create policy "app_revisions_select_own" on public.app_revisions for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.app_revisions from anon, authenticated;
grant select on public.app_revisions to authenticated;

alter table public.apps add column if not exists published_revision_id uuid;
alter table public.apps drop constraint if exists apps_published_revision_id_fkey;
alter table public.apps add constraint apps_published_revision_id_fkey foreign key (published_revision_id)
  references public.app_revisions(id) on delete set null;

-- 短时预览凭据只保存 SHA-256 哈希；令牌原文仅在创建时返回给管理端。
create table if not exists public.page_preview_tokens (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  context jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_page_preview_tokens_lookup on public.page_preview_tokens(token_hash, expires_at);
alter table public.page_preview_tokens enable row level security;
revoke all on public.page_preview_tokens from anon, authenticated;

-- 补齐旧应用的系统页面元数据。运行时由 Nuxt 固定页面渲染，schema 仅用于统一管理与版本化。
insert into public.pages(user_id, app_id, title, slug, route_key, page_type, is_home, show_in_tabbar, sort, schema)
select a.user_id, a.id, v.title, a.slug || '-' || v.route_key, v.route_key, v.page_type,
  false, v.route_key = 'profile', v.sort,
  jsonb_build_object('pageId','','title',v.title,'slug',a.slug || '-' || v.route_key,'themeName','normal','globalStyle','{}'::jsonb,'blocks','[]'::jsonb,'appId',a.id,'routeKey',v.route_key,'pageType',v.page_type)
from public.apps a
cross join (values ('profile','profile','个人中心',1), ('product-detail','product-detail','商品详情',2), ('article-detail','article-detail','文章详情',3)) as v(route_key,page_type,title,sort)
where not exists (select 1 from public.pages p where p.app_id=a.id and p.route_key=v.route_key);

create or replace function public.publish_app(p_app_id uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare app_row public.apps%rowtype; page_row public.pages%rowtype; revision_id uuid; app_revision_id uuid; next_version int;
begin
  if not exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','editor')) then
    raise exception 'permission denied';
  end if;
  select * into app_row from public.apps where id=p_app_id and user_id=auth.uid() for update;
  if app_row.id is null then raise exception 'app not found or access denied'; end if;
  -- 首次发布将所有页面在同一事务内固化为公开版本；之后页面由 publish_page 独立更新。
  if app_row.status <> 'published' then
    for page_row in select * from public.pages where app_id=p_app_id and user_id=auth.uid() order by sort, created_at loop
      select coalesce(max(version), 0) + 1 into next_version from public.page_revisions where page_id=page_row.id;
      insert into public.page_revisions(page_id,user_id,version,title,schema,created_by)
        values(page_row.id, auth.uid(), next_version, page_row.title, page_row.schema, auth.uid()) returning id into revision_id;
      update public.pages set status='published', published_revision_id=revision_id, published_at=now(), updated_at=now() where id=page_row.id;
    end loop;
  end if;
  insert into public.app_revisions(app_id,user_id,config,created_by)
    values(p_app_id, auth.uid(), jsonb_build_object('homeRouteKey',app_row.home_route_key,'layoutConfig',app_row.layout_config,'themeConfig',app_row.theme_config), auth.uid())
    returning id into app_revision_id;
  update public.apps set status='published', published_revision_id=app_revision_id, published_at=now(), updated_at=now()
    where id=p_app_id;
  return app_revision_id;
end; $$;

create or replace function public.create_page_preview_token(p_page_id uuid, p_context jsonb default '{}'::jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare raw_token text;
begin
  if not exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','editor')) then raise exception 'permission denied'; end if;
  if not exists(select 1 from public.pages where id=p_page_id and user_id=auth.uid()) then raise exception 'page not found or access denied'; end if;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.page_preview_tokens(page_id,user_id,token_hash,context,expires_at)
    values(p_page_id, auth.uid(), encode(extensions.digest(raw_token, 'sha256'), 'hex'), coalesce(p_context, '{}'::jsonb), now() + interval '15 minutes');
  return raw_token;
end; $$;

create or replace function public.get_published_app_route(p_app_slug text, p_route_key text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,
      'homeRouteKey',ar.config->>'homeRouteKey','layoutConfig',ar.config->'layoutConfig','themeConfig',ar.config->'themeConfig'),
    'page', jsonb_build_object('id',p.id,'title',r.title,'routeKey',p.route_key,'pageType',p.page_type,'schema',r.schema)
  )
  from public.apps a
  join public.app_revisions ar on ar.id=a.published_revision_id
  join public.pages p on p.app_id=a.id
  join public.page_revisions r on r.id=p.published_revision_id
  where a.slug=p_app_slug and a.status='published'
    and p.route_key=coalesce(p_route_key, a.home_route_key) and p.status='published'
  limit 1;
$$;

create or replace function public.get_preview_page_by_token(p_token text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config),
    'page', jsonb_build_object('id',p.id,'title',p.title,'routeKey',p.route_key,'pageType',p.page_type,'schema',p.schema),
    'preview',true,'previewContext',t.context
  )
  from public.page_preview_tokens t
  join public.pages p on p.id=t.page_id
  join public.apps a on a.id=p.app_id
  where t.token_hash=encode(extensions.digest(p_token, 'sha256'), 'hex') and t.expires_at > now()
  limit 1;
$$;

create or replace function public.get_published_app_product(p_app_slug text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',ar.config->>'homeRouteKey','layoutConfig',ar.config->'layoutConfig','themeConfig',ar.config->'themeConfig'),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'price',x.price,'origin_price',x.origin_price,'tag',x.tag,'buy_link',x.buy_link,'description',x.description)
  ) from public.apps a join public.app_revisions ar on ar.id=a.published_revision_id
  join public.products x on x.user_id=a.user_id
  where a.slug=p_app_slug and a.status='published' and x.id=p_entity_id and x.status='published' limit 1;
$$;

create or replace function public.get_published_app_article(p_app_slug text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',ar.config->>'homeRouteKey','layoutConfig',ar.config->'layoutConfig','themeConfig',ar.config->'themeConfig'),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'summary',x.summary,'content',x.content,'author_name',x.author_name,'publish_time',x.publish_time)
  ) from public.apps a join public.app_revisions ar on ar.id=a.published_revision_id
  join public.articles x on x.user_id=a.user_id
  where a.slug=p_app_slug and a.status='published' and x.id=p_entity_id and x.status='published' limit 1;
$$;

create or replace function public.get_preview_app_product(p_token text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'price',x.price,'origin_price',x.origin_price,'tag',x.tag,'buy_link',x.buy_link,'description',x.description)
  ) from public.page_preview_tokens t join public.pages p on p.id=t.page_id join public.apps a on a.id=p.app_id
  join public.products x on x.user_id=a.user_id
  where t.token_hash=encode(extensions.digest(p_token,'sha256'),'hex') and t.expires_at>now() and x.id=p_entity_id and x.status='published' limit 1;
$$;

create or replace function public.get_preview_app_article(p_token text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'summary',x.summary,'content',x.content,'author_name',x.author_name,'publish_time',x.publish_time)
  ) from public.page_preview_tokens t join public.pages p on p.id=t.page_id join public.apps a on a.id=p.app_id
  join public.articles x on x.user_id=a.user_id
  where t.token_hash=encode(extensions.digest(p_token,'sha256'),'hex') and t.expires_at>now() and x.id=p_entity_id and x.status='published' limit 1;
$$;

create or replace function public.resolve_published_page_data_source(p_page_id uuid, p_source_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists(
    select 1 from public.page_data_source_bindings b join public.pages p on p.id=b.page_id join public.apps a on a.id=p.app_id
    where b.page_id=p_page_id and b.source_id=p_source_id and p.status='published' and p.published_revision_id is not null and a.status='published'
  ) then return null; end if;
  return public.resolve_public_data_source(p_source_id);
end; $$;

create or replace function public.resolve_preview_page_data_source(p_token text, p_source_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare preview_page_id uuid;
begin
  select page_id into preview_page_id from public.page_preview_tokens
    where token_hash=encode(extensions.digest(p_token, 'sha256'),'hex') and expires_at > now();
  if preview_page_id is null or not exists(select 1 from public.page_data_source_bindings where page_id=preview_page_id and source_id=p_source_id) then
    return null;
  end if;
  return public.resolve_public_data_source(p_source_id);
end; $$;

revoke all on function public.publish_app(uuid) from public, anon;
revoke all on function public.create_page_preview_token(uuid,jsonb) from public, anon;
revoke all on function public.get_published_app_route(text,text) from public;
revoke all on function public.get_preview_page_by_token(text) from public;
revoke all on function public.get_published_app_product(text,uuid) from public;
revoke all on function public.get_published_app_article(text,uuid) from public;
revoke all on function public.get_preview_app_product(text,uuid) from public;
revoke all on function public.get_preview_app_article(text,uuid) from public;
revoke all on function public.resolve_published_page_data_source(uuid,uuid) from public;
revoke all on function public.resolve_preview_page_data_source(text,uuid) from public;
revoke all on function public.resolve_public_data_source(uuid) from anon, authenticated;
revoke all on function public.get_published_page_by_slug(text) from anon, authenticated;
grant execute on function public.publish_app(uuid) to authenticated;
grant execute on function public.create_page_preview_token(uuid,jsonb) to authenticated;
grant execute on function public.get_published_app_route(text,text) to anon, authenticated;
grant execute on function public.get_preview_page_by_token(text) to anon, authenticated;
grant execute on function public.get_published_app_product(text,uuid) to anon, authenticated;
grant execute on function public.get_published_app_article(text,uuid) to anon, authenticated;
grant execute on function public.get_preview_app_product(text,uuid) to anon, authenticated;
grant execute on function public.get_preview_app_article(text,uuid) to anon, authenticated;
grant execute on function public.resolve_published_page_data_source(uuid,uuid) to anon, authenticated;
grant execute on function public.resolve_preview_page_data_source(text,uuid) to anon, authenticated;
