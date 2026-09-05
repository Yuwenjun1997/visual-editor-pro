-- Additive content and login configuration; existing pages and content are preserved.
alter table public.products add column if not exists content jsonb not null default '{}'::jsonb;
alter table public.apps add column if not exists login_config jsonb not null default '{}'::jsonb;

create or replace function public.get_published_app_route(p_app_slug text, p_route_key text default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config,'loginConfig',a.login_config),
    'page', jsonb_build_object('id',p.id,'title',p.title,'routeKey',p.route_key,'pageType',p.page_type,'schema',p.schema)
  )
  from public.apps a
  join public.pages p on p.app_id=a.id
  where a.slug=p_app_slug and a.status='published'
    and p.route_key=coalesce(p_route_key, a.home_route_key)
  limit 1;
$$;
revoke all on function public.get_published_app_route(text,text) from public;
grant execute on function public.get_published_app_route(text,text) to anon, authenticated;

create or replace function public.get_published_app_product(p_app_slug text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config,'loginConfig',a.login_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'price',x.price,'origin_price',x.origin_price,'tag',x.tag,'buy_link',x.buy_link,'description',x.description,'content',x.content)
  ) from public.apps a join public.products x on x.user_id=a.user_id
  where a.slug=p_app_slug and a.status='published' and x.id=p_entity_id and x.status='published' limit 1;
$$;
revoke all on function public.get_published_app_product(text,uuid) from public;
grant execute on function public.get_published_app_product(text,uuid) to anon, authenticated;

create or replace function public.get_published_app_article(p_app_slug text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config,'loginConfig',a.login_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'summary',x.summary,'content',x.content,'author_name',x.author_name,'publish_time',x.publish_time)
  ) from public.apps a join public.articles x on x.user_id=a.user_id
  where a.slug=p_app_slug and a.status='published' and x.id=p_entity_id and x.status='published' limit 1;
$$;
revoke all on function public.get_published_app_article(text,uuid) from public;
grant execute on function public.get_published_app_article(text,uuid) to anon, authenticated;

create or replace function public.get_preview_app_product(p_token text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config,'loginConfig',a.login_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'price',x.price,'origin_price',x.origin_price,'tag',x.tag,'buy_link',x.buy_link,'description',x.description,'content',x.content)
  ) from public.page_preview_tokens t join public.pages p on p.id=t.page_id join public.apps a on a.id=p.app_id
  join public.products x on x.user_id=a.user_id
  where t.token_hash=encode(extensions.digest(p_token,'sha256'),'hex') and t.expires_at>now() and x.id=p_entity_id and x.status='published' limit 1;
$$;
revoke all on function public.get_preview_app_product(text,uuid) from public;
grant execute on function public.get_preview_app_product(text,uuid) to anon, authenticated;

create or replace function public.get_preview_app_article(p_token text, p_entity_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'app', jsonb_build_object('id',a.id,'slug',a.slug,'name',a.name,'homeRouteKey',a.home_route_key,'layoutConfig',a.layout_config,'themeConfig',a.theme_config,'loginConfig',a.login_config),
    'item', jsonb_build_object('id',x.id,'title',x.title,'cover_url',x.cover_url,'summary',x.summary,'content',x.content,'author_name',x.author_name,'publish_time',x.publish_time)
  ) from public.page_preview_tokens t join public.pages p on p.id=t.page_id join public.apps a on a.id=p.app_id
  join public.articles x on x.user_id=a.user_id
  where t.token_hash=encode(extensions.digest(p_token,'sha256'),'hex') and t.expires_at>now() and x.id=p_entity_id and x.status='published' limit 1;
$$;
revoke all on function public.get_preview_app_article(text,uuid) from public;
grant execute on function public.get_preview_app_article(text,uuid) to anon, authenticated;

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
        'themeConfig', a.theme_config,
        'loginConfig', a.login_config
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

-- Public app configuration is independent of the existence of a home page.
create or replace function public.get_published_app_config(p_app_slug text)
returns jsonb language sql stable security definer set search_path = public as $$
 select jsonb_build_object(
  'id', a.id, 'slug', a.slug, 'name', a.name,
  'homeRouteKey', a.home_route_key, 'layoutConfig', a.layout_config,
  'themeConfig', a.theme_config, 'loginConfig', a.login_config
 )
 from public.apps a where a.slug = p_app_slug and a.status = 'published' limit 1;
$$;
revoke all on function public.get_published_app_config(text) from public;
grant execute on function public.get_published_app_config(text) to anon, authenticated;
