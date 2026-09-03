import { setHeader } from 'h3'
import { createRequestSupabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')
  const supabase = createRequestSupabase(event)
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return { profile: null }
  const { data } = await supabase.from('profiles').select('id, full_name, avatar_url').eq('id', userId).maybeSingle()
  return { profile: data || null }
})
