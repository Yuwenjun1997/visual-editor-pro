import { getRouterParam } from 'h3'
import { loadRuntimePreview } from '../../../utils/runtime'

export default defineEventHandler((event) => loadRuntimePreview(event, getRouterParam(event, 'token') || ''))
