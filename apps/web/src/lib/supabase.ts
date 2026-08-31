import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export function requireUserId(user: { id: string } | null | undefined): string {
  if (!user?.id) throw new Error('未登录,无法执行该操作')
  return user.id
}