import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './plugins/element-ui/index'
import './plugins/monaco-editor/index'
import { setupIconify } from './plugins/iconify'
import { registryComponent } from './utils/visual.registry'
import { setupVisual } from './plugins/visual-components'

export function createApp() {
  const app = createSSRApp(App)

  setupIconify()

  registryComponent()

  app.use(createPinia())

  setupVisual(app)

  return {
    app,
  }
}
