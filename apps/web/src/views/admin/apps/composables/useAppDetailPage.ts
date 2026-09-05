import { appService } from '../../../../services/app.service'
import { pageService } from '../../../../services/page.service'
import { productService } from '../../../../services/product.service'
import { articleService } from '../../../../services/article.service'
import type { AppRow, PageRow } from '../../../../types/api'
import { ElMessage, ElMessageBox } from 'element-plus'
export const useAppDetailPage = () => {
  const route = useRoute()
  const router = useRouter()
  const app = ref<AppRow | null>(null)
  const pages = ref<PageRow[]>([])
  const loading = ref(true)
  const previewPickerVisible = ref(false)
  const previewPickerLoading = ref(false)
  const previewPickerSaving = ref(false)
  const previewPickerType = ref<'product' | 'article'>('product')
  const previewPickerPage = ref<PageRow | null>(null)
  const previewOptions = ref<Array<{ id: string; title: string }>>([])
  const previewSelectedId = ref('')
  const pageTypeLabels: Record<string, string> = {
    home: '首页',
    profile: '个人中心',
    'product-detail': '商品详情',
    'article-detail': '文章详情',
    custom: '自定义页面',
  }
  const load = async () => {
    loading.value = true
    try {
      const result = await appService.get(String(route.params.appId))
      app.value = result
      pages.value = await appService.pages(String(route.params.appId))
      if (!app.value) ElMessage.error('应用不存在')
    } catch (error: any) {
      ElMessage.error(error?.message || '应用加载失败')
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const preview = async (row: PageRow) => {
    if (row.page_type === 'product-detail' || row.page_type === 'article-detail') {
      await openPreviewPicker(row)
      return
    }
    await openPreviewWindow(row)
  }
  const openPreviewPicker = async (row: PageRow) => {
    previewPickerPage.value = row
    previewPickerType.value = row.page_type === 'article-detail' ? 'article' : 'product'
    previewSelectedId.value = ''
    previewOptions.value = []
    previewPickerVisible.value = true
    previewPickerLoading.value = true
    try {
      const result =
        previewPickerType.value === 'product'
          ? await productService.list({ page: 1, pageSize: 5, status: 'published' })
          : await articleService.list({ page: 1, pageSize: 5, status: 'published' })
      previewOptions.value = result.items.map((item) => ({ id: item.id, title: item.title }))
    } catch (error: any) {
      previewPickerVisible.value = false
      ElMessage.error(error?.message || '预览数据加载失败')
    } finally {
      previewPickerLoading.value = false
    }
  }
  const confirmPreviewSelection = async () => {
    if (!previewPickerPage.value || !previewSelectedId.value) return
    previewPickerSaving.value = true
    previewPickerVisible.value = false
    try {
      await openPreviewWindow(previewPickerPage.value, { entityId: previewSelectedId.value })
    } finally {
      previewPickerSaving.value = false
    }
  }
  const openPreviewWindow = async (row: PageRow, context: Record<string, string> = {}) => {
    let popup: Window | null = null
    try {
      popup = window.open('about:blank', '_blank')
      if (!popup) return ElMessage.warning('预览窗口被浏览器拦截，请允许打开新窗口')
      popup.opener = null
      const token = await pageService.createPreviewToken(row.id, context)
      const origin = (import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000').replace(/\/$/, '')
      popup.location.href = `${origin}/_preview/${token}`
    } catch (error: any) {
      popup?.close()
      if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '预览创建失败')
    }
  }
  const createCustomPage = async () => {
    if (!app.value) return
    try {
      const titleResult = await ElMessageBox.prompt('页面标题', '新建自定义页', {
        inputValue: '自定义页面',
        inputPattern: /\S+/,
        inputErrorMessage: '标题不能为空',
      })
      const routeResult = await ElMessageBox.prompt('页面地址（小写字母、数字、连字符）', '新建自定义页', {
        inputValue: `page-${Date.now()}`,
        inputPattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        inputErrorMessage: '请输入合法页面地址',
      })
      const page = await appService.createCustomPage(app.value, {
        title: titleResult.value,
        routeKey: routeResult.value,
      })
      router.push({ name: 'editor-app-review', params: { appId: app.value.id, pageId: page.id } })
    } catch (error: any) {
      if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '创建页面失败')
    }
  }
  return {
    route,
    router,
    app,
    pages,
    loading,
    previewPickerVisible,
    previewPickerLoading,
    previewPickerSaving,
    previewPickerType,
    previewOptions,
    previewSelectedId,
    pageTypeLabels,
    preview,
    confirmPreviewSelection,
    createCustomPage,
  }
}
