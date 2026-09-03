import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './plugins/element-ui/index'
import { setupIconify } from './plugins/iconify'
import { setupVisual, registryComponent, visualConfig } from '@visual/editor'
import { isValidPageSlug, normalizePageSlug } from '@visual/editor'
import type { PageSchema, VisualPublishResult, VisualSaveResult } from '@visual/editor'
import { ElMessage, ElMessageBox } from 'element-plus'
import '@visual/ui'
import '@visual/editor'
import '@visual/ui/style.css'
import '@visual/editor/style.css'
import './styles/tailwind/index.css'
import './assets/fonts/iconfont.css'
import { useAuthStore } from './stores/auth'
import { pageService } from './services/page.service'
import { businessDataService } from './services/business-data.service'
import { dataSourceService } from './services/data-source.service'

setupIconify()

registryComponent()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
// 等待用户与 profile/role 初始化完成后再挂载，避免后台布局先以 null 权限渲染。
// 后续 token 刷新由 auth store 保留已有 profile，不会造成菜单闪烁。
authStore.init().then(() => {
  app.mount('#app')
})

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

  let slug = normalizePageSlug(data.slug || '')
  if (!slug) {
    const promptResult = await ElMessageBox.prompt('请输入页面地址标识，只能使用小写字母、数字和连字符', '页面地址', {
      inputValue: `page-${crypto.randomUUID().slice(0, 8)}`,
      inputPattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      inputErrorMessage: '请输入合法的 slug',
    }).catch(() => null)
    if (!promptResult) return
    slug = (promptResult.value || '').trim().toLowerCase()
  }
  if (!isValidPageSlug(slug)) {
    ElMessage.error('页面地址不合法')
    return
  }

  const blocks = await businessDataService.migrateLegacyBusinessRefs(data.blocks, authStore.user.id)
  const schema: PageSchema = { ...data, title, slug, blocks }

  const pageId = await pageService.saveWithBindings({
    pageId: isUuid(data.pageId) ? String(data.pageId) : null,
    title,
    schema,
  })

  ElMessage.success('保存成功')
  return { pageId, title, slug, blocks } as VisualSaveResult
}

visualConfig.onPublish = async (data) => {
  if (!authStore.user || !isUuid(String(data.pageId))) {
    ElMessage.warning('请先保存页面草稿')
    return
  }
  const revisionId = await pageService.publish(String(data.pageId))
  return { revisionId } as VisualPublishResult
}

visualConfig.revisionProvider = {
  async list(pageId) {
    const [page, rows] = await Promise.all([pageService.get(String(pageId)), pageService.listRevisions(String(pageId))])
    return {
      currentRevisionId: page?.published_revision_id || null,
      revisions: rows.map((row) => ({
        id: row.id,
        version: row.version,
        title: row.title,
        createdAt: row.created_at,
        isCurrent: row.id === page?.published_revision_id,
      })),
    }
  },
  async rollback(pageId, revisionId) {
    await pageService.rollback(String(pageId), revisionId)
  },
}

visualConfig.savedPageLoader = async (id) => {
  const row = await pageService.get(id as string)
  return row && authStore.user
    ? {
        ...row.schema,
        // `pages.id` is the source of truth. Older rows (and the first save
        // before the returned id is applied to the editor state) may contain
        // an empty or stale schema.pageId, which would make the next save
        // look like a create operation.
        pageId: row.id,
        slug: row.slug,
        blocks: await businessDataService.migrateLegacyBusinessRefs(row.schema.blocks || [], authStore.user.id),
      }
    : null
}

visualConfig.dataSourceProvider = dataSourceService

setupVisual(app)
