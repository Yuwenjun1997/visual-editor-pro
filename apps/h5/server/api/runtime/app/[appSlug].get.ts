import { loadRuntimeApp } from '../../../utils/runtime'
export default defineEventHandler((event) => loadRuntimeApp(event, String(getRouterParam(event, 'appSlug') || '')))
