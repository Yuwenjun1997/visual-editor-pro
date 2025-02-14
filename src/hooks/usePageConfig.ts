import type { CSSProperties } from 'vue'

export interface PageConfig {
  pageId: string | number
  title: string
  globalStyle: CSSProperties
}

const pageConfig = ref<PageConfig>({
  pageId: '',
  title: '',
  globalStyle: {},
})

export const usePageConfig = () => {
  return {
    pageConfig,
  }
}
