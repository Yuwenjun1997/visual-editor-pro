import { ElMessage, ElMessageBox } from 'element-plus'
import { pageService } from '../../../../services/page.service'
import type { PageRevision, PageRow } from '../../../../types/api'
import { usePermission } from '../../../../lib/rbac'
export const usePagesPage = () => {
  const router = useRouter()
  const { can } = usePermission()
  const pages = ref<PageRow[]>([])
  const loading = ref(false)
  const publishing = ref<string | null>(null)
  const revisionDialogVisible = ref(false)
  const revisionLoading = ref(false)
  const revisions = ref<PageRevision[]>([])
  const revisionPage = ref<PageRow | null>(null)
  const load = async () => {
    loading.value = true
    try {
      pages.value = await pageService.list()
    } catch (error: any) {
      ElMessage.error(error?.message || '页面加载失败')
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const formatTime = (value: string) => {
    if (!value) return ''
    return new Date(value).toLocaleString('zh-CN', {
      hour12: false,
    })
  }
  const hasUnpublishedDraft = (row: PageRow) =>
    row.status === 'published' &&
    !!row.published_at &&
    new Date(row.updated_at).getTime() > new Date(row.published_at).getTime()
  const handleAction = (command: string | number | object, row: PageRow) => {
    switch (command) {
      case 'edit':
        editPage(row)
        break
      case 'preview':
        previewPage(row)
        break
      case 'publish':
        publishPage(row)
        break
      case 'revisions':
        openRevisions(row)
        break
      case 'delete':
        removePage(row)
        break
    }
  }
  const createPage = () => {
    router.push({ name: 'editor-create' })
  }
  const editPage = (row: PageRow) => {
    router.push({ name: 'editor-review', params: { pageId: row.id } })
  }
  const previewPage = async (row: PageRow) => {
    const previewWindow = window.open('about:blank', '_blank')
    if (!previewWindow) return ElMessage.warning('预览窗口被浏览器拦截，请允许打开新窗口')
    previewWindow.opener = null
    try {
      const token = await pageService.createPreviewToken(row.id)
      const origin = import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000'
      previewWindow.location.href = `${origin.replace(/\/$/, '')}/_preview/${token}`
    } catch (error: any) {
      previewWindow.close()
      ElMessage.error(error?.message || '预览创建失败')
    }
  }
  const publishPage = async (row: PageRow) => {
    if (publishing.value) return
    publishing.value = row.id
    try {
      await pageService.publish(row.id)
      ElMessage.success('发布成功')
      await load()
    } catch (error: any) {
      ElMessage.error(error?.message || '发布失败')
    } finally {
      publishing.value = null
    }
  }
  const openRevisions = async (row: PageRow) => {
    revisionPage.value = row
    revisionDialogVisible.value = true
    revisionLoading.value = true
    try {
      revisions.value = await pageService.listRevisions(row.id)
    } catch (error: any) {
      ElMessage.error(error?.message || '版本加载失败')
    } finally {
      revisionLoading.value = false
    }
  }
  const rollbackRevision = async (revisionId: string) => {
    if (!revisionPage.value) return
    try {
      await ElMessageBox.confirm('回滚后该版本会立即成为线上版本，确定继续吗？', '回滚确认', { type: 'warning' })
      await pageService.rollback(revisionPage.value.id, revisionId)
      ElMessage.success('回滚成功')
      revisionDialogVisible.value = false
      await load()
    } catch (error: any) {
      if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '回滚失败')
    }
  }
  const removePage = async (row: PageRow) => {
    await ElMessageBox.confirm(`确定删除页面「${row.title}」吗?该操作不可恢复。`, '删除确认', {
      type: 'warning',
    })
      .then(async () => {
        await pageService.remove(row.id)
        ElMessage.success('已删除')
        load()
      })
      .catch(() => {})
  }
  return {
    router,
    can,
    pages,
    loading,
    publishing,
    revisionDialogVisible,
    revisionLoading,
    revisions,
    revisionPage,
    formatTime,
    hasUnpublishedDraft,
    handleAction,
    createPage,
    rollbackRevision,
  }
}
