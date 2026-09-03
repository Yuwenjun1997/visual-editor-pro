import { supabase } from '../lib/supabase'
import type { AppRow, PageRow } from '../types/api'
import type { AppLayoutConfig, AppPageType, PageSchema } from '@visual/editor'
import { isValidPageSlug, normalizePageSlug } from '@visual/editor'

export const normalizeAppSlug = (value: string): string =>
  normalizePageSlug(value)
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')

export const DEFAULT_LAYOUT: AppLayoutConfig = {
  showTabbar: true,
  tabbarPosition: 'bottom',
  tabbarHeight: 52,
  backgroundColor: '#ffffff',
  activeColor: '#2563eb',
  inactiveColor: '#6b7280',
  safeArea: true,
  items: [
    { key: 'home', label: '首页', icon: 'bi bi-house', routeKey: 'home', visible: true, sort: 0 },
    { key: 'profile', label: '我的', icon: 'bi bi-person', routeKey: 'profile', visible: true, sort: 1 },
  ],
}

const SYSTEM_TEMPLATES: Array<{ routeKey: string; pageType: AppPageType; title: string }> = [
  { routeKey: 'home', pageType: 'home', title: '首页' },
  { routeKey: 'profile', pageType: 'profile', title: '个人中心' },
  { routeKey: 'product-detail', pageType: 'product-detail', title: '商品详情' },
  { routeKey: 'article-detail', pageType: 'article-detail', title: '文章详情' },
]

const block = (text: string) => ({
  _vid: `vid_${crypto.randomUUID().slice(0, 8)}`,
  key: 'VisualText',
  label: '文本',
  moduleName: 'basicWidgets' as const,
  componentName: 'VisualText',
  props: { text, fontSize: 'lg', textAlign: 'center' },
  styles: { padding: '32px 16px' },
})

export const createTemplateSchema = (
  appId: string,
  routeKey: string,
  pageType: AppPageType,
  title: string,
): PageSchema => ({
  pageId: '',
  title,
  slug: `${appId}-${routeKey}`,
  themeName: 'theme-blue',
  globalStyle: { backgroundColor: '#f7f8fa' },
  blocks: [block(title)],
  appId,
  routeKey,
  pageType,
})

export const appService = {
  async list(): Promise<AppRow[]> {
    const { data, error } = await supabase.from('apps').select('*').order('updated_at', { ascending: false })
    if (error) throw error
    return (data || []) as AppRow[]
  },
  async get(id: string): Promise<AppRow | null> {
    const { data, error } = await supabase.from('apps').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return (data as AppRow) || null
  },
  async pages(id: string): Promise<PageRow[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('app_id', id)
      .order('sort')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return (data || []) as PageRow[]
  },
  async create(payload: {
    userId: string
    name: string
    slug: string
    templates?: Array<{ routeKey: string; pageType: AppPageType; title: string }>
  }) {
    const slug = normalizeAppSlug(payload.slug)
    if (!isValidPageSlug(slug)) throw new Error('应用标识只能使用小写字母、数字和连字符，长度不超过 80 个字符')
    const { data, error } = await supabase
      .from('apps')
      .insert({ user_id: payload.userId, name: payload.name, slug, layout_config: DEFAULT_LAYOUT, theme_config: {} })
      .select()
      .single()
    if (error) throw error
    const app = data as AppRow
    const pages = SYSTEM_TEMPLATES.map((template, sort) => ({
      user_id: payload.userId,
      app_id: app.id,
      title: template.title,
      slug: `${slug}-${template.routeKey}`,
      route_key: template.routeKey,
      page_type: template.pageType,
      is_home: template.routeKey === 'home',
      show_in_tabbar: ['home', 'profile'].includes(template.routeKey),
      sort,
      schema: createTemplateSchema(app.id, template.routeKey, template.pageType, template.title),
    }))
    const { error: pageError } = await supabase.from('pages').insert(pages)
    if (pageError) {
      await supabase.from('apps').delete().eq('id', app.id)
      throw pageError
    }
    return app
  },
  async update(
    id: string,
    payload: Partial<
      Pick<AppRow, 'name' | 'slug' | 'logo' | 'home_route_key' | 'layout_config' | 'theme_config' | 'status'>
    >,
  ) {
    const { data, error } = await supabase.from('apps').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data as AppRow
  },
  async remove(id: string) {
    const { error } = await supabase.from('apps').delete().eq('id', id)
    if (error) throw error
  },
  async publish(id: string): Promise<string> {
    const { data, error } = await supabase.rpc('publish_app', { p_app_id: id })
    if (error) throw error
    return data as string
  },
  async createCustomPage(app: AppRow, payload: { title: string; routeKey: string }) {
    const routeKey = normalizeAppSlug(payload.routeKey)
    if (!isValidPageSlug(routeKey) || ['profile', 'product-detail', 'article-detail'].includes(routeKey)) {
      throw new Error('页面地址不合法或与系统页面冲突')
    }
    const { data, error } = await supabase
      .from('pages')
      .insert({
        user_id: app.user_id,
        app_id: app.id,
        title: payload.title.trim().slice(0, 40) || '未命名页面',
        slug: `${app.slug}-${routeKey}`,
        route_key: routeKey,
        page_type: 'custom',
        sort: Date.now(),
        schema: createTemplateSchema(app.id, routeKey, 'custom', payload.title.trim() || '未命名页面'),
      })
      .select()
      .single()
    if (error) throw error
    return data as PageRow
  },
}
