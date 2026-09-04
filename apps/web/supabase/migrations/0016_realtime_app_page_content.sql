-- 应用公开访问读取当前页面内容，保存后无需下线再发布即可生效。
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

revoke all on function public.get_published_app_route(text, text) from public;
grant execute on function public.get_published_app_route(text, text) to anon, authenticated;
