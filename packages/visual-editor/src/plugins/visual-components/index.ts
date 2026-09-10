import VisualComponents from '@visual/ui'
import type { App } from 'vue'
import { mountThemeToRoot } from '@visual/ui/hooks/useMountThemeToRoot'
import { setupMonaco } from '../monaco-editor'
import { visualThemeConfig } from '../../configs/visual-theme'
import type { CustomThemeConfig } from '@visual/ui/types'

export const setupVisual = (
  app: App,
  options: CustomThemeConfig = visualThemeConfig,
  runtime: { mountTheme?: boolean } = {},
) => {
  app.use(VisualComponents, { ...visualThemeConfig, ...options })
  if (runtime.mountTheme) app.onUnmount(mountThemeToRoot())
  setupMonaco()
}
