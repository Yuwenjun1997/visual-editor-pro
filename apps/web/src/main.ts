import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registryComponent, setupVisual } from '@visual/editor'
import App from './App.vue'
import router from './router'
import { setupVisualHostConfig } from './editor/setup-visual-host-config'
import { useAuthStore } from './stores/auth'
import { setupIconify } from './plugins/iconify'
import './plugins/element-ui/index'
import '@visual/ui'
import '@visual/editor'
import '@visual/ui/style.css'
import '@visual/editor/style.css'
import './styles/tailwind/index.css'
import './assets/fonts/iconfont.css'
import 'nprogress/nprogress.css'
import './styles/nprogress.css'

setupIconify()
registryComponent()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
setupVisualHostConfig(authStore)

// 等待用户与 profile/role 初始化完成后再挂载，避免后台布局先以 null 权限渲染。
// 后续 token 刷新由 auth store 保留已有 profile，不会造成菜单闪烁。
authStore.init().then(() => {
  app.mount('#app')
})

setupVisual(app)
