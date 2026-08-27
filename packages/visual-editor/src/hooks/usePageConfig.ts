import type { CSSProperties } from 'vue'

export interface PageConfig {
  pageId: string | number
  title: string
  globalStyle: CSSProperties
  themeName: string
}

const pageConfig = ref<PageConfig>({
  pageId: '',
  title: '',
  globalStyle: {},
  themeName: ''
})

export const usePageConfig = () => {
  return {
    pageConfig,
  }
}
