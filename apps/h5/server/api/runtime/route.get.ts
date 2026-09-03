import { getQuery } from 'h3'
import { loadRuntimeRoute } from '../../utils/runtime'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const appSlug = String(query.app || '')
  const routeKey = query.route ? String(query.route) : undefined
  if (!appSlug) throw createError({ statusCode: 400, statusMessage: '缺少应用标识' })
  return loadRuntimeRoute(event, appSlug, routeKey)
})
