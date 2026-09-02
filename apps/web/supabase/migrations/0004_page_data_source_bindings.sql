-- 0004_page_data_source_bindings.sql
-- 页面与可复用数据源的引用索引，以及页面+索引原子保存 RPC。

create table if not exists public.page_data_source_bindings (
  page_id uuid not null references public.pages (id) on delete cascade,
  source_id uuid not null references public.visual_data_sources (id) on delete restrict,
  block_vid text not null check (char_length(trim(block_vid)) between 1 and 120),
  binding_path text not null check (char_length(trim(binding_path)) between 1 and 240),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (page_id, block_vid, binding_path),
  unique (page_id, source_id, block_vid, binding_path)
);

create index if not exists idx_page_data_source_bindings_source on public.page_data_source_bindings (source_id, user_id);
create index if not exists idx_page_data_source_bindings_page on public.page_data_source_bindings (page_id, user_id);

alter table public.page_data_source_bindings enable row level security;
create policy "page_data_source_bindings_select_own" on public.page_data_source_bindings
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "page_data_source_bindings_insert_own" on public.page_data_source_bindings
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "page_data_source_bindings_delete_own" on public.page_data_source_bindings
  for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on table public.page_data_source_bindings from anon;
grant select, insert, delete on table public.page_data_source_bindings to authenticated;

create or replace function public.save_page_with_data_source_bindings(
  p_page_id uuid,
  p_title text,
  p_schema jsonb,
  p_bindings jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  saved_page_id uuid;
  binding jsonb;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  if p_page_id is null then
    insert into public.pages (user_id, title, schema)
      values ((select auth.uid()), left(trim(coalesce(p_title, '')), 40), p_schema)
      returning id into saved_page_id;
  else
    update public.pages
      set title = left(trim(coalesce(p_title, '')), 40), schema = p_schema, updated_at = now()
      where id = p_page_id and user_id = (select auth.uid())
      returning id into saved_page_id;
    if saved_page_id is null then
      raise exception 'page not found or access denied';
    end if;
  end if;

  delete from public.page_data_source_bindings
    where page_id = saved_page_id and user_id = (select auth.uid());

  for binding in select value from jsonb_array_elements(coalesce(p_bindings, '[]'::jsonb)) loop
    if jsonb_typeof(binding) <> 'object'
      or nullif(binding->>'sourceId', '') is null
      or nullif(binding->>'blockVid', '') is null
      or nullif(binding->>'bindingPath', '') is null then
      raise exception 'invalid data source binding';
    end if;
    if not exists (
      select 1 from public.visual_data_sources
        where id = (binding->>'sourceId')::uuid and user_id = (select auth.uid())
    ) then
      raise exception 'data source not found or access denied';
    end if;
    insert into public.page_data_source_bindings (page_id, source_id, block_vid, binding_path, user_id)
      values (saved_page_id, (binding->>'sourceId')::uuid, binding->>'blockVid', binding->>'bindingPath', (select auth.uid()));
  end loop;
  return saved_page_id;
end;
$$;

revoke all on function public.save_page_with_data_source_bindings(uuid, text, jsonb, jsonb) from anon, public;
grant execute on function public.save_page_with_data_source_bindings(uuid, text, jsonb, jsonb) to authenticated;
