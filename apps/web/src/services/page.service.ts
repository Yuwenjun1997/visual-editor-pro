import { supabase } from '../lib/supabase'
import type { PageRevision, PageRow } from '../types/api'
import type { PageSchema } from '@visual/editor'

export interface PageDataSourceBinding {
  sourceId: string
  blockVid: string
  bindingPath: string
}

const collectBindings = (blocks: PageSchema['blocks'], output: PageDataSourceBinding[] = []) => {
  for (const block of blocks) {
    const options = (block.props as Record<string, any> | undefined)?.options
    if (options?.dataSource === 'managed' && options.sourceId) {
      output.push({ sourceId: options.sourceId, blockVid: block._vid, bindingPath: 'props.options.sourceId' })
    }
    if (block.slots) Object.values(block.slots).forEach((slot) => collectBindings(slot.blocks, output))
  }
  return output
}

export const pageService = {
  collectBindings,
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

  async saveWithBindings(payload: { pageId: string | null; title: string; schema: PageSchema }) {
    const slug = payload.schema.slug || `page-${crypto.randomUUID().slice(0, 8)}`
    const { data, error } = await supabase.rpc('save_draft_page', {
      p_page_id: payload.pageId,
      p_title: payload.title,
      p_slug: slug,
      p_schema: payload.schema,
      p_bindings: collectBindings(payload.schema.blocks),
    })
    if (error) throw error
    return data as string
  },

  async publish(id: string): Promise<string> {
    const { data, error } = await supabase.rpc('publish_page', { p_page_id: id })
    if (error) throw error
    return data as string
  },

  async createPreviewToken(id: string, context: Record<string, any> = {}): Promise<string> {
    const { data, error } = await supabase.rpc('create_page_preview_token', { p_page_id: id, p_context: context })
    if (error) throw error
    return data as string
  },

  async listRevisions(id: string): Promise<PageRevision[]> {
    const { data, error } = await supabase
      .from('page_revisions')
      .select('id, page_id, version, title, schema, created_by, created_at')
      .eq('page_id', id)
      .order('version', { ascending: false })
    if (error) throw error
    return (data || []) as PageRevision[]
  },

  async rollback(id: string, revisionId: string): Promise<string> {
    const { data, error } = await supabase.rpc('rollback_page', {
      p_page_id: id,
      p_revision_id: revisionId,
    })
    if (error) throw error
    return data as string
  },

  async listBindings(sourceId: string) {
    const { data, error } = await supabase
      .from('page_data_source_bindings')
      .select('page_id, source_id, block_vid, binding_path, pages(id, title, updated_at)')
      .eq('source_id', sourceId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async remove(id: string) {
    const { error } = await supabase.from('pages').delete().eq('id', id)
    if (error) throw error
  },
}
