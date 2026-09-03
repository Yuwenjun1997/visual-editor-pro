import { getQuery, getRouterParam } from 'h3'
import { loadRuntimePreviewDetail } from '../../../utils/runtime'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const kind = query.kind === 'article' ? 'article' : 'product'
  return loadRuntimePreviewDetail(event, kind, getRouterParam(event, 'token') || '', String(query.id || ''))
})
