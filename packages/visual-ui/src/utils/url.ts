import type { H5Runtime } from '../hooks/useH5Runtime'
import type { VisualUrl, VisualUrlValue } from '../types/url'

export const isVisualUrl = (value: unknown): value is VisualUrl =>
  !!value && typeof value === 'object' && ['global-page', 'app-page', 'external'].includes((value as VisualUrl).mode) && typeof (value as VisualUrl).url === 'string'

export const normalizeVisualUrl = (value?: VisualUrlValue): VisualUrl | null => {
  if (!value) return null
  return isVisualUrl(value) ? value : { mode: 'external', url: value }
}

export const appendVisualUrlQuery = (value: VisualUrlValue, query: string): VisualUrl | null => {
  const target = normalizeVisualUrl(value)
  if (!target) return null
  return { ...target, url: `${target.url}${target.url.includes('?') ? '&' : '?'}${query}` }
}

export const navigateVisualUrl = (value: VisualUrlValue | undefined, runtime: H5Runtime) => {
  const target = normalizeVisualUrl(value)
  if (!target?.url) return
  if (target.mode === 'app-page') return runtime.$navigateTo(target.url, { appPage: true })
  window.open(target.url, '_blank', 'noopener,noreferrer')
}
