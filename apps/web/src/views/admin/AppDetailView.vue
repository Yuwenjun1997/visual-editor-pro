<template>
  <div class="admin-page">
    <el-page-header title="应用管理" class="wa-mb-5" @back="router.push({ name: 'apps' })">
      <template #content>
        <span class="wa-text-base wa-font-medium">{{ app?.name || '应用详情' }}-页面管理</span>
      </template>
      <template #extra>
        <el-button type="primary" @click="createCustomPage">新建自定义页</el-button>
      </template>
    </el-page-header>
    <el-table v-loading="loading" :data="pages">
      <el-table-column label="页面名称" prop="title" />
      <el-table-column label="页面地址" prop="route_key" />
      <el-table-column label="页面类型">
        <template #default="{ row }">{{ pageTypeLabels[row.page_type || 'custom'] }}</template>
      </el-table-column>
      <el-table-column label="导航">
        <template #default="{ row }">
          <el-tag v-if="row.show_in_tabbar" size="small">TabBar</el-tag>
          <span v-else class="wa-text-[var(--el-text-color-secondary)]">不显示</span>
        </template>
      </el-table-column>
      <el-table-column label="首页">
        <template #default="{ row }"><el-tag v-if="row.is_home" size="small" type="success">首页</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button
            v-if="!['profile', 'product-detail', 'article-detail'].includes(row.page_type || '')"
            size="small"
            @click="router.push({ name: 'editor-review', params: { pageId: row.id } })"
          >
            编辑页面
          </el-button>
          <el-button size="small" @click="preview(row as PageRow)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="previewPickerVisible"
      width="460px"
      :title="`选择${previewPickerType === 'product' ? '商品' : '文章'}预览数据`"
    >
      <div v-loading="previewPickerLoading">
        <el-empty v-if="!previewPickerLoading && !previewOptions.length" description="暂无可预览数据" />
        <el-select
          v-else
          v-model="previewSelectedId"
          class="wa-w-full"
          :placeholder="`请选择${previewPickerType === 'product' ? '商品' : '文章'}`"
        >
          <el-option v-for="item in previewOptions" :key="item.id" :value="item.id" :label="item.title" />
        </el-select>
      </div>
      <template #footer>
        <el-button @click="previewPickerVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!previewSelectedId"
          :loading="previewPickerSaving"
          @click="confirmPreviewSelection"
        >
          预览
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { appService } from '../../services/app.service'
import { pageService } from '../../services/page.service'
import { productService } from '../../services/product.service'
import { articleService } from '../../services/article.service'
import type { AppRow, PageRow } from '../../types/api'
import { ElMessage, ElMessageBox } from 'element-plus'
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
    const page = await appService.createCustomPage(app.value, { title: titleResult.value, routeKey: routeResult.value })
    router.push({ name: 'editor-review', params: { pageId: page.id } })
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '创建页面失败')
  }
}
</script>
