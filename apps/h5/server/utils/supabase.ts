import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie } from 'h3'
import type { H3Event } from 'h3'

export const createRequestSupabase = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  return createServerClient(config.public.supabaseUrl, config.public.supabasePublishableKey, {
    cookies: {
      getAll: () => Object.entries(parseCookies(event)).map(([name, value]) => ({ name, value })),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => setCookie(event, name, value, options)),
    },
  })
}
