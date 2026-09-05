export interface AppLoginConfig {
  layout: 'card' | 'brand' | 'background'
  logo: string
  title: string
  subtitle: string
  backgroundImage: string
  backgroundColor: string
  primaryColor: string
  radius: number
  buttonText: string
  agreementName: string
  agreementUrl: string
  requireAgreement: boolean
}
export const DEFAULT_LOGIN_CONFIG: AppLoginConfig = {
  layout: 'card',
  logo: '',
  title: '欢迎回来',
  subtitle: '登录你的账户，开启美好体验',
  backgroundImage: '',
  backgroundColor: '#eef2ff',
  primaryColor: '#4f46e5',
  radius: 24,
  buttonText: '登录',
  agreementName: '用户协议',
  agreementUrl: '',
  requireAgreement: false,
}
export const normalizeLoginConfig = (value?: Partial<AppLoginConfig> | null): AppLoginConfig => {
  const result = { ...DEFAULT_LOGIN_CONFIG, ...value }
  if (!['card', 'brand', 'background'].includes(result.layout)) result.layout = 'card'
  result.radius = Math.min(40, Math.max(0, Number(result.radius) || 0))
  return result
}
export const safeLoginRedirect = (value: unknown, appSlug: string): string => {
  const root = '/apps/' + encodeURIComponent(appSlug)
  const fallback = root + '/profile'
  if (typeof value !== 'string' || !value.startsWith(root + '/') || /[\\\r\n]/.test(value)) return fallback
  try {
    const url = new URL(value, 'https://local.invalid')
    if (
      url.origin !== 'https://local.invalid' ||
      !url.pathname.startsWith(root + '/') ||
      url.pathname === root + '/login'
    )
      return fallback
    if (decodeURIComponent(url.pathname).includes('..') || /%2f|%5c/i.test(url.pathname)) return fallback
    return url.pathname + url.search + url.hash
  } catch {
    return fallback
  }
}
