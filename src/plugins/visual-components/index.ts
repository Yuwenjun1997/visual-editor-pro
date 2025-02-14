import VisualComponents from '@/uni_modules/visual-components/index'
import type { App } from 'vue'

export const setupVisual = (app: App) => {
  app.use(VisualComponents)
}
