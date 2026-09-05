export default defineNuxtPlugin(() => {
  const { refresh, state } = useH5Auth()
  useBrowserSupabase().auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') state.value = { status: 'anonymous', profile: null }
    // Run outside the Supabase auth callback to avoid lock re-entry.
    setTimeout(() => {
      void refresh()
    }, 0)
  })
})
