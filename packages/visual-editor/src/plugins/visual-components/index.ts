import VisualComponents from '@visual/ui'
import type { App } from 'vue'
import { mountThemeToRoot } from '../../hooks/useMountThemeToRoot'

export const setupVisual = (app: App) => {
  app.use(VisualComponents)
  mountThemeToRoot()
}