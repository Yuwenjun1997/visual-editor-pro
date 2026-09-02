-- 兼容已存在的旧 visual_data_sources 表。
-- 0003 使用 CREATE TABLE IF NOT EXISTS，旧表存在时不会自动补齐新字段。
alter table if exists public.visual_data_sources
  add column if not exists source_kind text not null default 'manual',
  add column if not exists entity_type text,
  add column if not exists query_config jsonb not null default '{}'::jsonb,
  add column if not exists data_contract text not null default 'manual-object',
  add column if not exists manual_data jsonb,
  add column if not exists status text not null default 'active',
  add column if not exists schema_version int not null default 1,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.visual_data_sources') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'visual_data_sources'
         and column_name = 'data'
     ) then
    execute 'update public.visual_data_sources set manual_data = coalesce(manual_data, to_jsonb(data)) where manual_data is null';
  end if;

  if to_regclass('public.visual_data_sources') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'visual_data_sources'
         and column_name = 'data_type'
     ) then
    execute $sql$update public.visual_data_sources
      set data_contract = case when data_type = 'list' then 'manual-list' else 'manual-object' end
      where data_contract is null or data_contract = 'manual-object'$sql$;
  end if;
end $$;

create index if not exists idx_visual_data_sources_user_contract
  on public.visual_data_sources (user_id, data_contract);

-- 让 PostgREST 立即重新读取 public schema。
notify pgrst, 'reload schema';
