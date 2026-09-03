import type { VisualRuntimeBlock } from '@visual/ui/types'

export type RuntimePageType = 'home' | 'profile' | 'product-detail' | 'article-detail' | 'custom'

export interface RuntimeApp {
  id: string
  slug: string
  name: string
  homeRouteKey: string
  themeConfig?: Record<string, any>
  layoutConfig: {
    showTabbar: boolean
    tabbarHeight: number
    backgroundColor: string
    activeColor: string
    inactiveColor: string
    safeArea: boolean
    items: Array<{ key: string; label: string; icon?: string; routeKey: string; visible?: boolean; sort?: number }>
  }
}

export interface RuntimePage {
  id: string
  title: string
  routeKey: string
  pageType: RuntimePageType
  schema: {
    themeName?: string
    globalStyle?: Record<string, string>
    blocks: VisualRuntimeBlock[]
  }
}

export interface RuntimePagePayload {
  app: RuntimeApp
  page: RuntimePage
  preview?: boolean
  previewContext?: { entityId?: string }
}

export interface RuntimeDetailPayload {
  app: RuntimeApp
  item: Record<string, any>
}
