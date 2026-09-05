import { upgradeTemplateBlocks } from '@visual/ui/utils'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import type { VisualRuntimeBlock } from '@visual/ui/types'
import type { RuntimePagePayload } from '../../app/types/runtime'

const getClient = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  if (!config.public.supabaseUrl || !config.public.supabasePublishableKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase 环境变量未配置' })
  }
  return createClient(config.public.supabaseUrl, config.public.supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

const collectManagedSources = (blocks: VisualRuntimeBlock[], sourceIds = new Set<string>()) => {
  for (const block of blocks) {
    const options = block.props?.options as { dataSource?: string; sourceId?: string } | undefined
    if (options?.dataSource === 'managed' && options.sourceId) sourceIds.add(options.sourceId)
    Object.values(block.slots || {}).forEach((slot) => collectManagedSources(slot.blocks, sourceIds))
  }
  return sourceIds
}

const applyData = (blocks: VisualRuntimeBlock[], values: Map<string, any>) => {
  for (const block of blocks) {
    const options = block.props?.options as { dataSource?: string; sourceId?: string } | undefined
    if (options?.dataSource === 'managed' && options.sourceId && values.has(options.sourceId)) {
      const value = values.get(options.sourceId)
      if (Array.isArray(value)) block.listData = value
      else if (value && typeof value === 'object') block.data = value
    }
    Object.values(block.slots || {}).forEach((slot) => applyData(slot.blocks, values))
  }
}

const clonePayload = (value: RuntimePagePayload): RuntimePagePayload => JSON.parse(JSON.stringify(value))

const hydratePageData = async (
  event: H3Event,
  payload: RuntimePagePayload,
  resolver: 'resolve_published_page_data_source' | 'resolve_preview_page_data_source' | 'resolve_public_data_source',
  token?: string,
) => {
  const cloned = clonePayload(payload)
  cloned.page.schema.blocks = upgradeTemplateBlocks(cloned.page.schema.blocks, cloned.page.pageType, cloned.page.title)
  const sourceIds = [...collectManagedSources(cloned.page.schema.blocks)]
  if (!sourceIds.length) return cloned

  const client = getClient(event)
  const entries = await Promise.all(
    sourceIds.map(async (sourceId) => {
      const args =
        resolver === 'resolve_preview_page_data_source'
          ? { p_token: token, p_source_id: sourceId }
          : resolver === 'resolve_public_data_source'
            ? { p_source_id: sourceId }
            : { p_page_id: cloned.page.id, p_source_id: sourceId }
      const { data, error } = await client.rpc(resolver, args)
      if (error) throw createError({ statusCode: 500, statusMessage: '页面数据源加载失败' })
      return [sourceId, data] as const
    }),
  )
  applyData(cloned.page.schema.blocks, new Map(entries))
  return cloned
}

export const loadRuntimeRoute = async (event: H3Event, appSlug: string, routeKey?: string) => {
  const { data, error } = await getClient(event).rpc('get_published_app_route', {
    p_app_slug: appSlug,
    p_route_key: routeKey || null,
  })
  if (error || !data) throw createError({ statusCode: 404, statusMessage: '页面不存在或尚未发布' })
  return hydratePageData(event, data as RuntimePagePayload, 'resolve_published_page_data_source')
}

export const loadRuntimePreview = async (event: H3Event, token: string) => {
  const { data, error } = await getClient(event).rpc('get_preview_page_by_token', { p_token: token })
  if (error || !data) throw createError({ statusCode: 404, statusMessage: '预览链接无效或已过期' })
  return hydratePageData(event, data as RuntimePagePayload, 'resolve_preview_page_data_source', token)
}

export const loadRuntimePublicPage = async (event: H3Event, slug: string) => {
  const { data, error } = await getClient(event).rpc('get_published_page_by_slug', { p_slug: slug })
  if (error || !data?.[0]) throw createError({ statusCode: 404, statusMessage: '页面不存在或尚未发布' })
  const page = data[0] as { id: string; slug: string; title: string; schema: RuntimePagePayload['page']['schema'] }
  const payload = {
    page: { id: page.id, title: page.title, routeKey: page.slug, pageType: 'custom' as const, schema: page.schema },
  }
  return hydratePageData(event, payload as RuntimePagePayload, 'resolve_public_data_source')
}

export const loadRuntimeDetail = async (
  event: H3Event,
  kind: 'product' | 'article',
  appSlug: string,
  entityId: string,
) => {
  const { data, error } = await getClient(event).rpc(
    kind === 'product' ? 'get_published_app_product' : 'get_published_app_article',
    { p_app_slug: appSlug, p_entity_id: entityId },
  )
  if (error || !data) throw createError({ statusCode: 404, statusMessage: '内容不存在或尚未发布' })
  return data as { app: RuntimePagePayload['app']; item: Record<string, any> }
}

export const loadRuntimePreviewDetail = async (
  event: H3Event,
  kind: 'product' | 'article',
  token: string,
  entityId: string,
) => {
  const { data, error } = await getClient(event).rpc(
    kind === 'product' ? 'get_preview_app_product' : 'get_preview_app_article',
    { p_token: token, p_entity_id: entityId },
  )
  if (error || !data) throw createError({ statusCode: 404, statusMessage: '预览数据不存在或链接已过期' })
  return data as { app: RuntimePagePayload['app']; item: Record<string, any> }
}

export const loadRuntimeApp = async (event: H3Event, appSlug: string) => {
  const { data, error } = await getClient(event).rpc('get_published_app_config', { p_app_slug: appSlug })
  if (error || !data) throw createError({ statusCode: 404, statusMessage: '应用不存在或尚未发布' })
  return data as RuntimePagePayload['app']
}
