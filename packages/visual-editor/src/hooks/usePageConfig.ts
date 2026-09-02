import type { CSSProperties } from 'vue'

export interface PageConfig {
  pageId: string | number
  title: string
  slug?: string
  globalStyle: CSSProperties
  themeName: string
}

const pageConfig = ref<PageConfig>({
  pageId: '',
  title: '',
  slug: '',
  globalStyle: {},
  themeName: '',
})

export const usePageConfig = () => {
  return {
    pageConfig,
  }
}
