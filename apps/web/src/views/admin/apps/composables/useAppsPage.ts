import { appService, normalizeAppSlug } from '../../../../services/app.service'
import type { AppRow } from '../../../../types/api'
import { useAuthStore } from '../../../../stores/auth'
export const useAppsPage = () => {
  const router = useRouter()
  const auth = useAuthStore()
  const apps = ref<AppRow[]>([])
  const loading = ref(true)
  const saving = ref(false)
  const createVisible = ref(false)
  const form = reactive({ name: '', slug: '' })
  const load = async () => {
    loading.value = true
    try {
      apps.value = await appService.list()
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const createApp = async () => {
    const slug = normalizeAppSlug(form.slug)
    if (!auth.user || !form.name.trim() || !slug)
      return ElMessage.warning('请填写合法的应用标识：只能使用小写字母、数字和连字符')
    saving.value = true
    try {
      const app = await appService.create({
        userId: auth.user.id,
        name: form.name.trim(),
        slug,
      })
      createVisible.value = false
      router.push({ name: 'app-detail', params: { appId: app.id } })
    } catch (e: any) {
      ElMessage.error(e.message || '创建失败')
    } finally {
      saving.value = false
    }
  }
  const openDetail = (app: AppRow) => router.push({ name: 'app-detail', params: { appId: app.id } })
  const handleAction = (command: string | number | object, app: AppRow) => {
    if (command === 'snapshots')
      router.push({ name: 'app-settings', params: { appId: app.id }, query: { panel: 'snapshots' } })
    else if (command === 'publish') publishApp(app)
    else if (command === 'offline') offlineApp(app)
    else if (command === 'delete') removeApp(app)
  }
  const previewApp = async (app: AppRow) => {
    const popup = window.open('about:blank', '_blank')
    if (!popup) return ElMessage.warning('预览窗口被浏览器拦截，请允许打开新窗口')
    popup.opener = null
    try {
      const pages = await appService.pages(app.id)
      const home =
        pages.find((page) => page.route_key === app.home_route_key) || pages.find((page) => page.is_home) || pages[0]
      if (!home) {
        popup.close()
        return ElMessage.warning('应用还没有可预览的页面')
      }
      const origin = (import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000').replace(/\/$/, '')
      // 应用预览使用应用公开地址；单页预览才使用短时令牌地址。
      const href = `${origin}/apps/${app.slug}`
      popup.location.href = href
    } catch (e: any) {
      popup.close()
      ElMessage.error(e.message || '预览失败')
    }
  }
  const publishApp = async (app: AppRow) => {
    try {
      await appService.publish(app.id)
      await load()
      ElMessage.success('应用发布成功')
    } catch (e: any) {
      ElMessage.error(e.message || '应用发布失败')
    }
  }
  const offlineApp = async (app: AppRow) => {
    try {
      await appService.update(app.id, { status: 'offline' })
      await load()
      ElMessage.success('应用已下线，公开地址将返回 404')
    } catch (e: any) {
      ElMessage.error(e.message || '应用下线失败')
    }
  }
  const removeApp = async (app: AppRow) => {
    await ElMessageBox.confirm(`确定删除“${app.name}”及其页面吗？`, '删除应用', { type: 'warning' })
    try {
      await appService.remove(app.id)
      await load()
      ElMessage.success('已删除')
    } catch (e: any) {
      ElMessage.error(e.message || '删除失败')
    }
  }
  return { router, apps, loading, saving, createVisible, form, createApp, openDetail, handleAction, previewApp }
}
