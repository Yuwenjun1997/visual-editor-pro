import { supabase } from '../lib/supabase'
import type { ContentListOptions, PaginatedResult, ProductRow } from '../types/api'

export type ProductPayload = Partial<{
  category_id: string | null
  title: string
  cover_url: string
  price: number | null
  origin_price: number | null
  tag: string
  buy_link: string
  status: 'published' | 'draft' | 'off'
  sort: number
  description: string
}>

export const productService = {
  async list(opts: ContentListOptions = { page: 1, pageSize: 100 }): Promise<PaginatedResult<ProductRow>> {
    const page = Math.max(1, opts.page)
    const pageSize = Math.min(100, Math.max(1, opts.pageSize))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
    if (opts?.categoryId) query = query.eq('category_id', opts.categoryId)
    if (opts?.status) query = query.eq('status', opts.status)
    const keyword = opts.keyword?.trim().replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
    if (keyword) query = query.ilike('title', `%${keyword}%`)
    const { data, error, count } = await query.range(from, to)
    if (error) throw error
    return { items: (data || []) as ProductRow[], total: count || 0 }
  },

  async create(payload: ProductPayload & { user_id: string }) {
    const { data, error } = await supabase.from('products').insert(payload).select().single()
    if (error) throw error
    return data as ProductRow
  },

  async update(id: string, payload: ProductPayload) {
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as ProductRow
  },

  async remove(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },
}
