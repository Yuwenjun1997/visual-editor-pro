-- 应用不再维护版本历史；改用用户主动创建的快照。
drop function if exists public.rollback_app(uuid, uuid);
drop function if exists public.get_published_app_route(text, text);
drop function if exists public.get_published_app_product(text, uuid);
drop function if exists public.get_published_app_article(text, uuid);
alter table public.apps drop constraint if exists apps_published_revision_id_fkey;
alter table public.apps drop column if exists published_revision_id;
drop table if exists public.app_revisions;

create table if not exists public.app_snapshots (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  app_config jsonb not null,
  pages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_app_snapshots_app_created on public.app_snapshots(app_id, created_at desc);
alter table public.app_snapshots enable row level security;
drop policy if exists "app_snapshots_own" on public.app_snapshots;
create policy "app_snapshots_own" on public.app_snapshots for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on table public.app_snapshots to authenticated;

create or replace function public.publish_app(p_app_id uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare app_row public.apps%rowtype; page_row public.pages%rowtype; revision_id uuid; next_version int;
begin
  if not exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','editor')) then
    raise exception 'permission denied';
  end if;
  select * into app_row from public.apps where id = p_app_id and user_id = auth.uid() for update;
  if app_row.id is null then raise exception 'app not found or access denied'; end if;
  for page_row in select * from public.pages where app_id = p_app_id and user_id = auth.uid() order by sort, created_at loop
    select coalesce(max(version), 0) + 1 into next_version from public.page_revisions where page_id = page_row.id;
    insert into public.page_revisions(page_id,user_id,version,title,schema,created_by)
      values(page_row.id, auth.uid(), next_version, page_row.title, page_row.schema, auth.uid()) returning id into revision_id;
    update public.pages set status='published', published_revision_id=revision_id, published_at=now(), updated_at=now() where id=page_row.id;
  end loop;
  update public.apps set status='published', published_at=now(), updated_at=now() where id=p_app_id;
  return p_app_id;
end; $$;

revoke all on function public.publish_app(uuid) from public, anon;
grant execute on function public.publish_app(uuid) to authenticated;

create or replace function public.get_published_app_route(p_app_slug text, p_route_key text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config),
    'page', jsonb_build_object('id',p.id,'title',p.title,'routeKey',p.route_key,'pageType',p.page_type,'schema',p.schema)
  )
  from public.apps a
  join public.pages p on p.app_id=a.id
  where a.slug=p_app_slug and a.status='published'
    and p.route_key=coalesce(p_route_key, a.home_route_key)
  limit 1;
$$;

create or replace function public.get_published_app_product(p_app_slug text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'price',x.price,'origin_price',x.origin_price,'tag',x.tag,'buy_link',x.buy_link,'description',x.description)
  ) from public.apps a join public.products x on x.user_id=a.user_id
  where a.slug=p_app_slug and a.status='published' and x.id=p_entity_id and x.status='published' limit 1;
$$;

create or replace function public.get_published_app_article(p_app_slug text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'summary',x.summary,'content',x.content,'author_name',x.author_name,'publish_time',x.publish_time)
  ) from public.apps a join public.articles x on x.user_id=a.user_id
  where a.slug=p_app_slug and a.status='published' and x.id=p_entity_id and x.status='published' limit 1;
$$;

grant execute on function public.get_published_app_route(text, text) to anon, authenticated;
grant execute on function public.get_published_app_product(text, uuid) to anon, authenticated;
grant execute on function public.get_published_app_article(text, uuid) to anon, authenticated;
