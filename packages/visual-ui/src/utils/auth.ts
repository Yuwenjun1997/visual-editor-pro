import type { H5AuthState } from '../hooks/useH5Runtime'
export interface AuthPolicy {
  mode?: 'all' | 'any'
  login?: 'any' | 'authenticated' | 'anonymous'
  roles?: string
}
export const canDisplay = (state: H5AuthState, policy: AuthPolicy): boolean => {
  if (state.status === 'loading' || state.status === 'error') return false
  const checks: boolean[] = []
  if (policy.login && policy.login !== 'any') checks.push(state.status === policy.login)
  const roles = (policy.roles || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
  if (roles.length) checks.push(state.status === 'authenticated' && roles.includes(state.profile?.role || ''))
  return !checks.length || (policy.mode === 'any' ? checks.some(Boolean) : checks.every(Boolean))
}
