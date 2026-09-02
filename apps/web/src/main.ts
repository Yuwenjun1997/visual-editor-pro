import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './plugins/element-ui/index'
import { setupIconify } from './plugins/iconify'
import { setupVisual, registryComponent, visualConfig } from '@visual/editor'
import type { PageSchema, VisualSaveResult } from '@visual/editor'
import { ElMessage, ElMessageBox } from 'element-plus'
import '@visual/ui'
import '@visual/editor'
import '@visual/ui/style.css'
import '@visual/editor/style.css'
import './styles/tailwind/index.css'
import './assets/fonts/iconfont.css'
import { useAuthStore } from './stores/auth'
import { categoryService } from './services/category.service'
import { pageService } from './services/page.service'
import { businessDataService } from './services/business-data.service'

setupIconify()

registryComponent()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
authStore.init()

// —— 宿主注入:编辑器保存 / 加载已存页面 / 业务数据提供者 ——
// 必须放在 registryComponent() 之后(clear() 只清模块数组,不影响这些字段)

const isUuid = (value: string | number): boolean =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

visualConfig.onSave = async (data) => {
  if (!authStore.user) {
    router.push({
      name: 'login',
      query: { redirect: router.currentRoute.value.fullPath },
    })
    return
  }

  let title = (data.title || '').trim()
  if (!title) {
    const promptResult = await ElMessageBox.prompt('请输入页面标题', '保存页面', {
      inputValue: '未命名页面',
      inputPattern: /\S+/,
      inputErrorMessage: '标题不能为空',
    }).catch(() => null)
    if (!promptResult) return
    title = (promptResult.value || '').trim()
  }
  if (!title) return
  title = title.slice(0, 40) || '未命名页面'

  // 保存前用最新数据重生成 businessDataRef 快照(deep-clone,不影响画布)
  const blocks = await businessDataService.rehydrateBusinessRefs(data.blocks)
  const schema: PageSchema = { ...data, title, blocks }

  let pageId: string | number = data.pageId
  if (isUuid(pageId)) {
    const existing = await pageService.get(pageId as string)
    if (existing) {
      await pageService.update(pageId as string, { title, schema })
    } else {
      pageId = await pageService.insert({
        user_id: authStore.user.id,
        title,
        schema,
      })
    }
  } else {
    pageId = await pageService.insert({
      user_id: authStore.user.id,
      title,
      schema,
    })
  }

  ElMessage.success('保存成功')
  return { pageId, blocks } as VisualSaveResult
}

visualConfig.savedPageLoader = async (id) => {
  const row = await pageService.get(id as string)
  return row?.schema ?? null
}

visualConfig.businessDataProvider = {
  listCategories: (type) => categoryService.listByType(type),
  resolveRows: (ref) => businessDataService.resolveBusinessRows(ref),
}

setupVisual(app)

app.mount('#app')
