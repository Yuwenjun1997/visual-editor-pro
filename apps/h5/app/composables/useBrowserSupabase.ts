import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const useBrowserSupabase = () => {
  if (client) return client
  const config = useRuntimeConfig()
  client = createBrowserClient(config.public.supabaseUrl, config.public.supabasePublishableKey)
  return client
}
