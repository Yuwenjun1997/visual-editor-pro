import { getRouterParam } from 'h3'
import { loadRuntimeDetail } from '../../../../utils/runtime'

export default defineEventHandler((event) =>
  loadRuntimeDetail(event, 'product', getRouterParam(event, 'appSlug') || '', getRouterParam(event, 'productId') || ''),
)
