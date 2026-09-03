import { getRouterParam } from 'h3'
import { loadRuntimeDetail } from '../../../../utils/runtime'

export default defineEventHandler((event) =>
  loadRuntimeDetail(event, 'article', getRouterParam(event, 'appSlug') || '', getRouterParam(event, 'articleId') || ''),
)
