import type { CSSProperties } from 'vue'

export interface PageConfig {
  pageId: string | number
  appId?: string
  title: string
  slug?: string
  globalStyle: CSSProperties
  themeName: string | null
}

const pageConfig = ref<PageConfig>({
  pageId: '',
  title: '',
  slug: '',
  globalStyle: {},
  themeName: null,
})

export const usePageConfig = () => {
  return {
    pageConfig,
  }
}
