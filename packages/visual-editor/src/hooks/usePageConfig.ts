import type { CSSProperties } from 'vue'
import { DEFAULT_VISUAL_THEME } from '../configs/visual-theme'
import type { VisualThemeName } from '../configs/visual-theme'

export interface PageConfig {
  pageId: string | number
  appId?: string
  title: string
  slug?: string
  globalStyle: CSSProperties
  themeName: VisualThemeName
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
