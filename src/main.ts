import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './plugins/element-ui/index'
import './plugins/monaco-editor/index'
import { setupIconify } from './plugins/iconify'
import { registryComponent } from './utils/visual.registry'
import { setupVisual } from './plugins/visual-components'
import './styles/tailwind/index.css'
import './assets/fonts/iconfont.css';
import './styles/index.scss';

const app = createApp(App)

setupIconify()

registryComponent()

app.use(createPinia())
app.use(router)
setupVisual(app)

app.mount('#app')
