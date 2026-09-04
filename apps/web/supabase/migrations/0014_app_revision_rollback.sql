-- 应用配置快照回退，并将应用恢复为已发布状态。
create or replace function public.rollback_app(p_app_id uuid, p_revision_id uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare revision_row public.app_revisions%rowtype;
begin
  if not exists(select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')) then
    raise exception 'permission denied';
  end if;
  select * into revision_row from public.app_revisions
    where id = p_revision_id and app_id = p_app_id and user_id = auth.uid();
  if revision_row.id is null then raise exception 'revision not found or access denied'; end if;
  update public.apps
    set home_route_key = coalesce(revision_row.config->>'homeRouteKey', home_route_key),
        layout_config = coalesce(revision_row.config->'layoutConfig', layout_config),
        theme_config = coalesce(revision_row.config->'themeConfig', theme_config),
        published_revision_id = revision_row.id,
        status = 'published', published_at = now(), updated_at = now()
    where id = p_app_id and user_id = auth.uid();
  return revision_row.id;
end; $$;

revoke all on function public.rollback_app(uuid, uuid) from public, anon;
grant execute on function public.rollback_app(uuid, uuid) to authenticated;
