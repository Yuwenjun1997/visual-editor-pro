-- 可复用数据源：页面只保存 sourceId，业务集合在渲染时读取 products/articles 的最新数据。
-- 本迁移替换尚未发布的旧草稿模型(column_key/component_key/data)。
create table if not exists public.visual_data_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  source_kind text not null check (source_kind in ('entity_collection', 'manual')),
  entity_type text check (entity_type in ('product', 'article')),
  query_config jsonb not null default '{}'::jsonb,
  data_contract text not null check (char_length(trim(data_contract)) between 1 and 80),
  manual_data jsonb,
  status text not null default 'active' check (status in ('active', 'disabled')),
  schema_version int not null default 1 check (schema_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint visual_data_sources_kind_fields check (
    (source_kind = 'entity_collection' and entity_type is not null and manual_data is null and jsonb_typeof(query_config) = 'object')
    or (source_kind = 'manual' and entity_type is null and manual_data is not null and jsonb_typeof(query_config) = 'object')
  ),
  constraint visual_data_sources_contract_kind check (
    (source_kind = 'entity_collection' and (
      (entity_type = 'product' and data_contract = 'product-list')
      or (entity_type = 'article' and data_contract = 'article-list')
    ))
    or (source_kind = 'manual' and data_contract like 'manual-%')
  ),
  constraint visual_data_sources_query_rules check (
    source_kind = 'manual'
    or (
      query_config - array['categoryId', 'entityIds', 'sort', 'limit']::text[] = '{}'::jsonb
      and jsonb_typeof(query_config -> 'sort') = 'string'
      and query_config ->> 'sort' in ('manual', 'newest', 'price_asc', 'price_desc')
      and jsonb_typeof(query_config -> 'limit') = 'number'
      and (query_config ->> 'limit')::int between 1 and 100
      and (
        (entity_type = 'article' and query_config ->> 'sort' in ('manual', 'newest'))
        or (entity_type = 'product' and query_config ->> 'sort' in ('manual', 'newest', 'price_asc', 'price_desc'))
      )
    )
  )
);

create index if not exists idx_visual_data_sources_user_updated on public.visual_data_sources (user_id, updated_at desc);
create index if not exists idx_visual_data_sources_user_contract on public.visual_data_sources (user_id, data_contract);
create index if not exists idx_visual_data_sources_user_status on public.visual_data_sources (user_id, status);
create unique index if not exists uq_visual_data_sources_entity_rule
  on public.visual_data_sources (user_id, source_kind, entity_type, data_contract, query_config)
  where source_kind = 'entity_collection';

alter table public.visual_data_sources enable row level security;
drop policy if exists "visual_data_sources_all_own" on public.visual_data_sources;
create policy "visual_data_sources_select_own" on public.visual_data_sources
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "visual_data_sources_insert_own" on public.visual_data_sources
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "visual_data_sources_update_own" on public.visual_data_sources
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "visual_data_sources_delete_own" on public.visual_data_sources
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 仅登录用户可经 Data API 访问自己的行；不依赖平台默认授权。
revoke all on table public.visual_data_sources from anon;
grant select, insert, update, delete on table public.visual_data_sources to authenticated;
