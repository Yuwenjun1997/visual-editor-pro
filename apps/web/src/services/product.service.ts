import { supabase } from '../lib/supabase'
import type { ProductRow } from '../types/api'

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
  async list(opts?: {
    categoryId?: string
    status?: string
  }): Promise<ProductRow[]> {
    let query = supabase
      .from('products')
      .select('*')
      .order('sort', { ascending: true })
    if (opts?.categoryId) query = query.eq('category_id', opts.categoryId)
    if (opts?.status) query = query.eq('status', opts.status)
    const { data, error } = await query
    if (error) throw error
    return (data || []) as ProductRow[]
  },

  async create(payload: ProductPayload & { user_id: string }) {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data as ProductRow
  },

  async update(id: string, payload: ProductPayload) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as ProductRow
  },

  async remove(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },
}