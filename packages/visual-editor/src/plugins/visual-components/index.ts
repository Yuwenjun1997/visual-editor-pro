import VisualComponents from '@visual/ui'
import type { App } from 'vue'
import { mountThemeToRoot } from '@visual/ui/hooks/useMountThemeToRoot'
import { setupMonaco } from '../monaco-editor'

export const setupVisual = (app: App) => {
  app.use(VisualComponents)
  mountThemeToRoot()
  setupMonaco()
}