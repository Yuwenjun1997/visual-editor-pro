import { loadRuntimePublicPage } from '../../../utils/runtime'

export default defineEventHandler((event) => loadRuntimePublicPage(event, getRouterParam(event, 'slug') || ''))
