-- 页面 slug、不可变版本和匿名公开读取 API。

alter table public.pages add column if not exists slug text;
alter table public.pages add column if not exists published_revision_id uuid;
alter table public.pages add column if not exists published_at timestamptz;

update public.pages
set slug = 'page-' || left(replace(id::text, '-', ''), 20)
where slug is null or trim(slug) = '';

alter table public.pages alter column slug set not null;
create unique index if not exists uq_pages_user_slug on public.pages (user_id, slug);

create table if not exists public.page_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version int not null check (version > 0),
  title text not null,
  schema jsonb not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(page_id, version)
);

alter table public.pages
  drop constraint if exists pages_published_revision_id_fkey;
alter table public.pages
  add constraint pages_published_revision_id_fkey
  foreign key (published_revision_id) references public.page_revisions(id) on delete set null;

create index if not exists idx_page_revisions_page_created
  on public.page_revisions(page_id, created_at desc);

alter table public.page_revisions enable row level security;
drop policy if exists "page_revisions_select_own" on public.page_revisions;
create policy "page_revisions_select_own" on public.page_revisions
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "page_revisions_insert_own" on public.page_revisions;
create policy "page_revisions_insert_own" on public.page_revisions
  for insert to authenticated with check ((select auth.uid()) = user_id and (select auth.uid()) = created_by);
revoke all on table public.page_revisions from anon;
grant select, insert on table public.page_revisions to authenticated;

create or replace function public.save_draft_page(
  p_page_id uuid,
  p_title text,
  p_slug text,
  p_schema jsonb,
  p_bindings jsonb default '[]'::jsonb
)
returns uuid language plpgsql security invoker set search_path = public as $$
declare saved_page_id uuid; binding jsonb;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' or char_length(p_slug) > 80 then
    raise exception 'invalid page slug';
  end if;
  if exists(select 1 from public.pages where user_id = auth.uid() and slug = p_slug and id <> p_page_id) then
    raise exception 'page slug already exists';
  end if;
  if p_page_id is null then
    insert into public.pages(user_id, title, slug, schema, status)
      values(auth.uid(), left(trim(coalesce(p_title, '')), 40), p_slug, p_schema, 'draft')
      returning id into saved_page_id;
  else
    update public.pages set title = left(trim(coalesce(p_title, '')), 40), slug = p_slug,
      schema = p_schema, status = case when published_revision_id is null then 'draft' else status end,
      updated_at = now() where id = p_page_id and user_id = auth.uid()
      returning id into saved_page_id;
    if saved_page_id is null then raise exception 'page not found or access denied'; end if;
  end if;
  delete from public.page_data_source_bindings where page_id = saved_page_id and user_id = auth.uid();
  for binding in select value from jsonb_array_elements(coalesce(p_bindings, '[]'::jsonb)) loop
    if jsonb_typeof(binding) <> 'object' or nullif(binding->>'sourceId', '') is null
      or nullif(binding->>'blockVid', '') is null or nullif(binding->>'bindingPath', '') is null then
      raise exception 'invalid data source binding';
    end if;
    if not exists(select 1 from public.visual_data_sources where id = (binding->>'sourceId')::uuid and user_id = auth.uid()) then
      raise exception 'data source not found or access denied';
    end if;
    insert into public.page_data_source_bindings(page_id, source_id, block_vid, binding_path, user_id)
      values(saved_page_id, (binding->>'sourceId')::uuid, binding->>'blockVid', binding->>'bindingPath', auth.uid());
  end loop;
  return saved_page_id;
end; $$;

create or replace function public.publish_page(p_page_id uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare page_row public.pages%rowtype; revision_id uuid; next_version int;
begin
  if not exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','editor')) then
    raise exception 'permission denied';
  end if;
  select * into page_row from public.pages where id = p_page_id and user_id = auth.uid() for update;
  if page_row.id is null then raise exception 'page not found or access denied'; end if;
  if exists(select 1 from public.page_data_source_bindings b join public.visual_data_sources s on s.id=b.source_id
    where b.page_id=p_page_id and b.user_id=auth.uid() and (s.status <> 'active' or s.user_id <> auth.uid())) then
    raise exception 'page contains disabled data source';
  end if;
  select coalesce(max(version), 0) + 1 into next_version from public.page_revisions where page_id = p_page_id;
  insert into public.page_revisions(page_id,user_id,version,title,schema,created_by)
    values(p_page_id, auth.uid(), next_version, page_row.title, page_row.schema, auth.uid()) returning id into revision_id;
  update public.pages set status='published', published_revision_id=revision_id, published_at=now(), updated_at=now()
    where id=p_page_id and user_id=auth.uid();
  return revision_id;
end; $$;

create or replace function public.rollback_page(p_page_id uuid, p_revision_id uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
begin
  if not exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','editor')) then raise exception 'permission denied'; end if;
  if not exists(select 1 from public.page_revisions where id=p_revision_id and page_id=p_page_id and user_id=auth.uid()) then
    raise exception 'revision not found or access denied';
  end if;
  update public.pages set published_revision_id=p_revision_id, status='published', published_at=now(), updated_at=now()
    where id=p_page_id and user_id=auth.uid();
  return p_revision_id;
end; $$;

create or replace function public.get_published_page_by_slug(p_slug text)
returns table(id uuid, slug text, title text, description text, schema jsonb, published_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.slug, r.title, p.description, r.schema, p.published_at
  from public.pages p join public.page_revisions r on r.id=p.published_revision_id
  where p.slug=p_slug and p.status='published';
$$;

create or replace function public.resolve_public_data_source(p_source_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare source public.visual_data_sources%rowtype; result jsonb;
begin
  select s.* into source from public.visual_data_sources s
  where s.id=p_source_id and s.status='active'
    and exists(select 1 from public.page_data_source_bindings b join public.pages p on p.id=b.page_id
      where b.source_id=s.id and p.status='published' and p.published_revision_id is not null);
  if source.id is null then return null; end if;
  if source.source_kind='manual' then return coalesce(source.manual_data, '[]'::jsonb); end if;
  if source.entity_type='product' then
    select coalesce(jsonb_agg(jsonb_build_object('id',x.id,'cover',coalesce(x.cover_url,''),'title',x.title,
      'price',x.price,'originPrice',x.origin_price,'tag',coalesce(x.tag,''),'buyLink',coalesce(x.buy_link,''))), '[]'::jsonb)
      into result from (select * from public.products x where x.user_id=source.user_id and x.status='published'
        and (source.query_config->>'categoryId' is null or x.category_id=(source.query_config->>'categoryId')::uuid)
        order by case when source.query_config->>'sort'='price_asc' then x.price end asc nulls last,
          case when source.query_config->>'sort'='price_desc' then x.price end desc nulls last,
          case when source.query_config->>'sort' not in ('price_asc','price_desc') then x.created_at end desc
        limit least(greatest(coalesce((source.query_config->>'limit')::int, 20),1),100)) x;
  else
    select coalesce(jsonb_agg(jsonb_build_object('id',x.id,'cover',coalesce(x.cover_url,''),'title',x.title,
      'authorName',coalesce(x.author_name,''),'authorAvatar','','publishTime',coalesce(x.publish_time::text,''))), '[]'::jsonb)
      into result from (select * from public.articles x where x.user_id=source.user_id and x.status='published'
        and (source.query_config->>'categoryId' is null or x.category_id=(source.query_config->>'categoryId')::uuid)
        order by x.publish_time desc nulls last limit least(greatest(coalesce((source.query_config->>'limit')::int,20),1),100)) x;
  end if;
  return result;
end; $$;

revoke all on function public.save_draft_page(uuid,text,text,jsonb,jsonb) from anon, public;
revoke all on function public.publish_page(uuid) from anon, public;
revoke all on function public.rollback_page(uuid,uuid) from anon, public;
revoke all on function public.get_published_page_by_slug(text) from public;
revoke all on function public.resolve_public_data_source(uuid) from public;
grant execute on function public.save_draft_page(uuid,text,text,jsonb,jsonb) to authenticated;
grant execute on function public.publish_page(uuid) to authenticated;
grant execute on function public.rollback_page(uuid,uuid) to authenticated;
grant execute on function public.get_published_page_by_slug(text) to anon, authenticated;
grant execute on function public.resolve_public_data_source(uuid) to anon, authenticated;
