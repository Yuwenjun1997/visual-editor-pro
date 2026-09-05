import type { H5AuthState } from '@visual/ui/types'
export const useH5Auth = () => {
  const state = useState<H5AuthState>('h5-auth', () => ({ status: 'loading', profile: null }))
  const requestFetch = useRequestFetch()
  const refresh = async () => {
    try {
      const result = await requestFetch<{ authenticated: boolean; profile: H5AuthState['profile'] }>('/api/me')
      state.value = { status: result.authenticated ? 'authenticated' : 'anonymous', profile: result.profile }
    } catch {
      state.value = { status: 'error', profile: null }
    }
  }
  const logout = async () => {
    const { error } = await useBrowserSupabase().auth.signOut()
    if (error) throw error
    state.value = { status: 'anonymous', profile: null }
    await refresh()
  }
  return { state, refresh, logout }
}
