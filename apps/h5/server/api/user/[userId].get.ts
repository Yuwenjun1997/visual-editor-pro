import { getRouterParam } from 'h3'
import { createRequestSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId') || ''
  const supabase = createRequestSupabase(event)
  const { data: claims } = await supabase.auth.getClaims()
  const authenticatedUserId = claims?.claims?.sub

  if (!authenticatedUserId) throw createError({ statusCode: 401, statusMessage: '请先登录' })
  if (userId !== authenticatedUserId) throw createError({ statusCode: 403, statusMessage: '无权查看该用户资料' })

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw createError({ statusCode: 503, statusMessage: '用户资料加载失败' })
  if (!data) throw createError({ statusCode: 404, statusMessage: '用户不存在' })

  return { profile: data }
})
