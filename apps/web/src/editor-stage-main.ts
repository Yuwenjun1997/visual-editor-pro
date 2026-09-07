import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupVisual, registryComponent } from '@visual/editor'
import VisualStageCanvas from '../../../packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue'
import '@visual/ui/style.css'
import '@visual/editor/style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(VisualStageCanvas)
app.use(createPinia())
registryComponent()
setupVisual(app, undefined, { mountTheme: true })
app.mount('#app')
