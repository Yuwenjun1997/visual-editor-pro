import { supabase } from '../lib/supabase'
import type { AppRow, AppSnapshotRow, PageRow } from '../types/api'
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
  _appId: string,
  routeKey: string,
  pageType: AppPageType,
  title: string,
): PageSchema => ({
  pageId: '',
  title,
  slug: `${_appId}-${routeKey}`,
  themeName: 'theme-blue',
  globalStyle: { backgroundColor: '#f7f8fa' },
  blocks: [block(title)],
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
  async snapshots(id: string): Promise<AppSnapshotRow[]> {
    const { data, error } = await supabase
      .from('app_snapshots')
      .select('*')
      .eq('app_id', id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as AppSnapshotRow[]
  },
  async removeSnapshot(id: string) {
    const { error } = await supabase.from('app_snapshots').delete().eq('id', id)
    if (error) throw error
  },
  async createSnapshot(payload: { app: AppRow; pages: PageRow[]; name: string }) {
    const { data, error } = await supabase
      .from('app_snapshots')
      .insert({
        app_id: payload.app.id,
        user_id: payload.app.user_id,
        name: payload.name.trim().slice(0, 80) || '应用快照',
        app_config: {
          name: payload.app.name,
          slug: payload.app.slug,
          logo: payload.app.logo,
          home_route_key: payload.app.home_route_key,
          theme_config: payload.app.theme_config,
          layout_config: payload.app.layout_config,
          status: payload.app.status,
        },
        pages: payload.pages,
      })
      .select()
      .single()
    if (error) throw error
    return data as AppSnapshotRow
  },
  async restoreSnapshot(snapshot: AppSnapshotRow) {
    const { error: appError } = await supabase.from('apps').update(snapshot.app_config).eq('id', snapshot.app_id)
    if (appError) throw appError
    const currentPages = await this.pages(snapshot.app_id)
    const snapshotPageIds = new Set(snapshot.pages.map((page) => page.id))
    for (const page of currentPages.filter((page) => !snapshotPageIds.has(page.id))) {
      const { error } = await supabase.from('pages').delete().eq('id', page.id).eq('app_id', snapshot.app_id)
      if (error) throw error
    }
    for (const page of snapshot.pages) {
      if (!currentPages.some((current) => current.id === page.id)) {
        const { error } = await supabase.from('pages').insert({
          user_id: snapshot.user_id,
          app_id: snapshot.app_id,
          title: page.title,
          slug: page.slug,
          description: page.description,
          status: page.status,
          schema: page.schema,
          route_key: page.route_key,
          page_type: page.page_type,
          is_home: page.is_home,
          show_in_tabbar: page.show_in_tabbar,
          sort: page.sort,
        })
        if (error) throw error
        continue
      }
      const { error } = await supabase
        .from('pages')
        .update({
          title: page.title,
          slug: page.slug,
          description: page.description,
          schema: page.schema,
          route_key: page.route_key,
          page_type: page.page_type,
          is_home: page.is_home,
          show_in_tabbar: page.show_in_tabbar,
          sort: page.sort,
        })
        .eq('id', page.id)
        .eq('app_id', snapshot.app_id)
      if (error) throw error
    }
  },
  async createCustomPage(app: AppRow, payload: { title: string; routeKey: string }) {
    const routeKey = normalizeAppSlug(payload.routeKey)
    if (!isValidPageSlug(routeKey) || ['profile', 'product-detail', 'article-detail'].includes(routeKey)) {
      throw new Error('页面地址不合法或与系统页面冲突')
    }
    const { data: lastPage, error: sortError } = await supabase
      .from('pages')
      .select('sort')
      .eq('app_id', app.id)
      .order('sort', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (sortError) throw sortError
    const { data, error } = await supabase
      .from('pages')
      .insert({
        user_id: app.user_id,
        app_id: app.id,
        title: payload.title.trim().slice(0, 40) || '未命名页面',
        slug: `${app.slug}-${routeKey}`,
        route_key: routeKey,
        page_type: 'custom',
        status: 'published',
        sort: (lastPage?.sort ?? -1) + 1,
        schema: createTemplateSchema(app.id, routeKey, 'custom', payload.title.trim() || '未命名页面'),
      })
      .select()
      .single()
    if (error) throw error
    return data as PageRow
  },
}
