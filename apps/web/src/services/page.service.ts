import { supabase } from '../lib/supabase'
import type { PageRow } from '../types/api'
import type { PageSchema } from '@visual/editor'

export const pageService = {
  async list(): Promise<PageRow[]> {
    const { data, error } = await supabase.from('pages').select('*').order('updated_at', { ascending: false })
    if (error) throw error
    return (data || []) as PageRow[]
  },

  async get(id: string): Promise<PageRow | null> {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return (data as PageRow) || null
  },

  async insert(payload: { user_id: string; title: string; schema: PageSchema }) {
    const { data, error } = await supabase.from('pages').insert(payload).select('id').single()
    if (error) throw error
    return (data as { id: string }).id
  },

  async update(id: string, payload: { title: string; schema: PageSchema }) {
    const { data, error } = await supabase.from('pages').update(payload).eq('id', id).select('id').single()
    if (error) throw error
    return (data as { id: string }).id
  },

  async remove(id: string) {
    const { error } = await supabase.from('pages').delete().eq('id', id)
    if (error) throw error
  },
}
