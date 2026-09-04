-- 允许全局页面管理中的独立页面使用预览令牌预览。
-- 应用页面继续返回真实应用配置；无 app_id 的页面使用最小预览壳。
create or replace function public.get_preview_page_by_token(p_token text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', case when a.id is not null then
      jsonb_build_object(
        'id', a.id,
        'slug', a.slug,
        'name', a.name,
        'homeRouteKey', a.home_route_key,
        'layoutConfig', a.layout_config,
        'themeConfig', a.theme_config
      )
    else
      jsonb_build_object(
        'id', '00000000-0000-0000-0000-000000000000',
        'slug', 'standalone',
        'name', '页面预览',
        'homeRouteKey', coalesce(p.route_key, p.schema->>'routeKey', p.slug),
        'layoutConfig', jsonb_build_object(
          'showTabbar', false,
          'tabbarHeight', 0,
          'backgroundColor', '#ffffff',
          'activeColor', '#2563eb',
          'inactiveColor', '#6b7280',
          'safeArea', false,
          'items', '[]'::jsonb
        ),
        'themeConfig', '{}'::jsonb
      )
    end,
    'page', jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'routeKey', coalesce(p.route_key, p.schema->>'routeKey', p.slug),
      'pageType', coalesce(p.page_type, p.schema->>'pageType', 'custom'),
      'schema', p.schema
    ),
    'preview', true,
    'previewContext', t.context
  )
  from public.page_preview_tokens t
  join public.pages p on p.id = t.page_id
  left join public.apps a on a.id = p.app_id
  where t.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and t.expires_at > now()
  limit 1;
$$;

revoke all on function public.get_preview_page_by_token(text) from public;
grant execute on function public.get_preview_page_by_token(text) to anon, authenticated;
