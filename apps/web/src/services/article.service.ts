import { supabase } from '../lib/supabase'
import type { ArticleRow } from '../types/api'

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
  async list(): Promise<ArticleRow[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('publish_time', { ascending: false })
    if (error) throw error
    return (data || []) as ArticleRow[]
  },

  async create(payload: ArticlePayload & { user_id: string }) {
    const { data, error } = await supabase
      .from('articles')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data as ArticleRow
  },

  async update(id: string, payload: ArticlePayload) {
    const { data, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as ArticleRow
  },

  async remove(id: string) {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) throw error
  },
}