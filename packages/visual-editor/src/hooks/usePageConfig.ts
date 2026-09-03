import type { CSSProperties } from 'vue'
import { DEFAULT_VISUAL_THEME } from '../configs/visual-theme'

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
  themeName: DEFAULT_VISUAL_THEME,
})

export const usePageConfig = () => {
  return {
    pageConfig,
  }
}
