import { supabase } from '../lib/supabase'
import type { CategoryRow } from '../types/api'

export interface CategoryOption {
  id: string
  name: string
}

export const categoryService = {
  async listByType(type: 'product' | 'article'): Promise<CategoryOption[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', type)
      .order('sort', { ascending: true })
    if (error) throw error
    return (data || []) as CategoryOption[]
  },

  async list(): Promise<CategoryRow[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('type', { ascending: true })
      .order('sort', { ascending: true })
    if (error) throw error
    return (data || []) as CategoryRow[]
  },

  async create(payload: { user_id: string; name: string; type: 'product' | 'article'; sort: number }) {
    const { data, error } = await supabase.from('categories').insert(payload).select().single()
    if (error) throw error
    return data as CategoryRow
  },

  async update(id: string, payload: Partial<{ name: string; sort: number }>) {
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as CategoryRow
  },

  async remove(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}
