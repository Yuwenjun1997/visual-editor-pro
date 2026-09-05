import { normalizeLoginConfig } from '@visual/ui/types'
import { appService, DEFAULT_LAYOUT } from '../../../../services/app.service'
import type { AppRow, AppSnapshotRow, PageRow } from '../../../../types/api'
export const useAppSettingsPage = () => {
  const activeTab = ref('basic')
  const route = useRoute()
  const router = useRouter()
  const loading = ref(true)
  const saving = ref(false)
  const editing = ref<AppRow | null>(null)
  const pages = ref<PageRow[]>([])
  const snapshots = ref<AppSnapshotRow[]>([])
  const snapshotVisible = ref(false)
  const cloneApp = (value: AppRow) => JSON.parse(JSON.stringify(value)) as AppRow
  const pageKey = (page: PageRow) => page.route_key || page.slug
  const ensureLayout = (value: AppRow) => {
    const result = cloneApp(value)
    result.login_config = normalizeLoginConfig(value.login_config)
    result.layout_config = {
      ...DEFAULT_LAYOUT,
      ...(result.layout_config || {}),
      items: result.layout_config?.items?.length
        ? result.layout_config.items
        : DEFAULT_LAYOUT.items.map((item) => ({ ...item })),
    }
    return result
  }
  const load = async () => {
    loading.value = true
    try {
      const app = await appService.get(String(route.params.appId))
      if (app) {
        editing.value = ensureLayout(app)
        const [appPages, appSnapshots] = await Promise.all([appService.pages(app.id), appService.snapshots(app.id)])
        pages.value = appPages
        snapshots.value = appSnapshots
        if (route.query.panel === 'snapshots') snapshotVisible.value = true
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '应用加载失败')
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const formatTime = (value: string) => (value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '')
  const createSnapshot = async () => {
    if (!editing.value) return
    try {
      const result = await ElMessageBox.prompt('请输入快照名称', '添加应用快照', {
        inputValue: `快照 ${new Date().toLocaleString('zh-CN', { hour12: false })}`,
        inputPattern: /\S+/,
        inputErrorMessage: '快照名称不能为空',
      })
      await appService.createSnapshot({ app: editing.value, pages: pages.value, name: result.value })
      snapshots.value = await appService.snapshots(editing.value.id)
      ElMessage.success('快照已创建')
    } catch (error: any) {
      if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '快照创建失败')
    }
  }
  const restoreSnapshot = async (snapshot: AppSnapshotRow) => {
    try {
      await ElMessageBox.confirm(`确定恢复快照「${snapshot.name}」吗？当前应用信息将被覆盖。`, '恢复快照', {
        type: 'warning',
      })
      await appService.restoreSnapshot(snapshot)
      await load()
      ElMessage.success('快照已恢复')
    } catch (error: any) {
      if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '快照恢复失败')
    }
  }
  const removeSnapshot = async (snapshot: AppSnapshotRow) => {
    try {
      await ElMessageBox.confirm(`确定删除快照「${snapshot.name}」吗？删除后无法恢复。`, '删除快照', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
      })
      await appService.removeSnapshot(snapshot.id)
      snapshots.value = snapshots.value.filter((item) => item.id !== snapshot.id)
      ElMessage.success('快照已删除')
    } catch (error: any) {
      if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '快照删除失败')
    }
  }
  const saveSettings = async () => {
    if (!editing.value) return
    if (editing.value.login_config.requireAgreement && !/^https?:\/\//i.test(editing.value.login_config.agreementUrl))
      return ElMessage.warning('请填写有效的协议链接')
    const visible = editing.value.layout_config.items.filter((item) => item.visible)
    if (visible.length > 5) return ElMessage.warning('底部导航最多显示 5 项')
    const pageKeys = new Set(pages.value.map(pageKey))
    if (visible.some((item) => !pageKeys.has(item.routeKey))) return ElMessage.warning('导航目标页面不存在')

    saving.value = true
    try {
      const saved = await appService.update(editing.value.id, {
        name: editing.value.name,
        home_route_key: editing.value.home_route_key,
        layout_config: editing.value.layout_config,
        login_config: normalizeLoginConfig(editing.value.login_config),
      })
      editing.value = ensureLayout(saved)
      ElMessage.success('设置已保存')
    } catch (error: any) {
      ElMessage.error(error?.message || '保存失败')
    } finally {
      saving.value = false
    }
  }
  return {
    activeTab,
    router,
    loading,
    saving,
    editing,
    pages,
    snapshots,
    snapshotVisible,
    pageKey,
    formatTime,
    createSnapshot,
    restoreSnapshot,
    removeSnapshot,
    saveSettings,
  }
}
