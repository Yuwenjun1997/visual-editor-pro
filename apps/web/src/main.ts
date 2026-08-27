import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './plugins/element-ui/index'
import './plugins/monaco-editor/index'
import { setupIconify } from './plugins/iconify'
import { setupVisual, registryComponent } from '@visual/editor'
import '@visual/ui'
import '@visual/editor'
import '@visual/ui/style.css'
import '@visual/editor/style.css'
import './styles/tailwind/index.css'
import './assets/fonts/iconfont.css'

setupIconify()

registryComponent()

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupVisual(app)

app.mount('#app')