import { supabase } from '../lib/supabase'
import type { ArticleRow, ContentListOptions, PaginatedResult } from '../types/api'

export type ArticlePayload = Partial<{
  category_id: string | null
  title: string
  cover_url: string
  summary: string
  content: { html?: string }
  author_name: string
  publish_time: string | null
  status: 'draft' | 'published'
}>

export const articleService = {
  async get(id: string): Promise<ArticleRow | null> {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data as ArticleRow | null
  },
  async list(opts: ContentListOptions = { page: 1, pageSize: 100 }): Promise<PaginatedResult<ArticleRow>> {
    const page = Math.max(1, opts.page)
    const pageSize = Math.min(100, Math.max(1, opts.pageSize))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase.from('articles').select('*', { count: 'exact' }).order('updated_at', { ascending: false })
    if (opts.categoryId) query = query.eq('category_id', opts.categoryId)
    if (opts.status) query = query.eq('status', opts.status)
    const keyword = opts.keyword?.trim().replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
    if (keyword) query = query.ilike('title', `%${keyword}%`)
    const { data, error, count } = await query.range(from, to)
    if (error) throw error
    return { items: (data || []) as ArticleRow[], total: count || 0 }
  },

  async create(payload: ArticlePayload & { user_id: string }) {
    const { data, error } = await supabase.from('articles').insert(payload).select().single()
    if (error) throw error
    return data as ArticleRow
  },

  async update(id: string, payload: ArticlePayload) {
    const { data, error } = await supabase.from('articles').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as ArticleRow
  },

  async remove(id: string) {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) throw error
  },
}
