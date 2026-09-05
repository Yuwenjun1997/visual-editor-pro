import { setHeader } from 'h3'
import { createRequestSupabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  const supabase = createRequestSupabase(event)
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return { authenticated: false, profile: null }
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: '账户资料加载失败' })
  return { authenticated: true, profile: data || { id: userId, full_name: null, avatar_url: null, role: null } }
})
