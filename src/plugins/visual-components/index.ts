import VisualComponents from '#visual-ui/index'
import type { App } from 'vue'

export const setupVisual = (app: App) => {
  app.use(VisualComponents)
}
