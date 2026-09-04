-- 发布应用时，authenticated 用户需要能够写入自己的应用配置快照。
drop policy if exists "app_revisions_insert_own" on public.app_revisions;
create policy "app_revisions_insert_own" on public.app_revisions
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select auth.uid()) = created_by);

grant insert on table public.app_revisions to authenticated;
