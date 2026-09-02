-- 修复已执行 0007 的环境：publish_page 以 SECURITY INVOKER 插入版本记录时，
-- page_revisions 必须同时拥有 authenticated 的 INSERT grant 和自有行策略。

alter table public.page_revisions enable row level security;

drop policy if exists "page_revisions_insert_own" on public.page_revisions;
create policy "page_revisions_insert_own" on public.page_revisions
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select auth.uid()) = created_by);

revoke all on table public.page_revisions from anon;
grant select, insert on table public.page_revisions to authenticated;

notify pgrst, 'reload schema';
