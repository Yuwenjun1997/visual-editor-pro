-- 编辑器舞台的登录态只读预览数据。此接口不依赖页面预览令牌，
-- 仅允许当前编辑者读取自己已发布的内容和已启用的数据源。

create or replace function public.get_editor_preview_detail(p_kind text, p_entity_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare result jsonb;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  if p_kind = 'product' then
    select jsonb_build_object(
      'id', x.id, 'title', x.title, 'cover_url', x.cover_url,
      'price', x.price, 'origin_price', x.origin_price, 'tag', x.tag,
      'buy_link', x.buy_link, 'description', x.description, 'content', x.content
    ) into result
    from public.products x
    where x.id = p_entity_id and x.user_id = auth.uid() and x.status = 'published';
  elsif p_kind = 'article' then
    select jsonb_build_object(
      'id', x.id, 'title', x.title, 'cover_url', x.cover_url,
      'summary', x.summary, 'content', x.content, 'author_name', x.author_name,
      'publish_time', x.publish_time
    ) into result
    from public.articles x
    where x.id = p_entity_id and x.user_id = auth.uid() and x.status = 'published';
  else
    raise exception 'invalid preview detail kind';
  end if;

  return result;
end;
$$;

create or replace function public.resolve_editor_preview_data_source(p_source_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  source public.visual_data_sources%rowtype;
  result jsonb;
  entity_ids text[];
  source_sort text;
  source_limit int;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  select s.* into source
  from public.visual_data_sources s
  where s.id = p_source_id and s.user_id = auth.uid() and s.status = 'active';
  if source.id is null then return null; end if;

  if source.source_kind = 'manual' then return coalesce(source.manual_data, '[]'::jsonb); end if;
  if source.source_kind <> 'entity_collection' or source.entity_type is null or source.entity_type not in ('product', 'article') then
    return null;
  end if;

  select coalesce(array_agg(value), '{}'::text[]) into entity_ids
  from jsonb_array_elements_text(coalesce(source.query_config->'entityIds', '[]'::jsonb));
  source_sort := coalesce(nullif(source.query_config->>'sort', ''), 'newest');
  source_limit := least(
    greatest(
      case when coalesce(source.query_config->>'limit', '') ~ '^[0-9]+$'
        then (source.query_config->>'limit')::int
        else 20
      end,
      1
    ),
    100
  );

  if source.entity_type = 'product' then
    select coalesce(jsonb_agg(row_data), '[]'::jsonb) into result
    from (
      select jsonb_build_object(
        'id', x.id, 'cover', coalesce(x.cover_url, ''), 'title', x.title,
        'price', x.price, 'originPrice', x.origin_price, 'tag', coalesce(x.tag, ''),
        'buyLink', coalesce(x.buy_link, '')
      ) as row_data
      from public.products x
      where x.user_id = source.user_id and x.status = 'published'
        and (source.query_config->>'categoryId' is null or x.category_id::text = source.query_config->>'categoryId')
        and (cardinality(entity_ids) = 0 or x.id::text = any(entity_ids))
      order by
        case when source_sort = 'manual' then array_position(entity_ids, x.id::text) end nulls last,
        case when source_sort not in ('price_asc', 'price_desc', 'newest') then x.sort end asc,
        case when source_sort = 'price_asc' then x.price end asc nulls last,
        case when source_sort = 'price_desc' then x.price end desc nulls last,
        case when source_sort = 'newest' then x.created_at end desc nulls last,
        x.id
      limit source_limit
    ) rows;
  else
    select coalesce(jsonb_agg(row_data), '[]'::jsonb) into result
    from (
      select jsonb_build_object(
        'id', x.id, 'cover', coalesce(x.cover_url, ''), 'title', x.title,
        'authorName', coalesce(x.author_name, ''), 'authorAvatar', '',
        'publishTime', coalesce(x.publish_time::text, ''), 'link', ''
      ) as row_data
      from public.articles x
      where x.user_id = source.user_id and x.status = 'published'
        and (source.query_config->>'categoryId' is null or x.category_id::text = source.query_config->>'categoryId')
        and (cardinality(entity_ids) = 0 or x.id::text = any(entity_ids))
      order by
        case when source_sort = 'manual' then array_position(entity_ids, x.id::text) end nulls last,
        case when source_sort = 'newest' then x.publish_time end desc nulls last,
        case when source_sort = 'manual' then x.created_at end desc nulls last,
        x.id
      limit source_limit
    ) rows;
  end if;

  return result;
end;
$$;

revoke all on function public.get_editor_preview_detail(text, uuid) from public, anon;
revoke all on function public.resolve_editor_preview_data_source(uuid) from public, anon;
grant execute on function public.get_editor_preview_detail(text, uuid) to authenticated;
grant execute on function public.resolve_editor_preview_data_source(uuid) to authenticated;
