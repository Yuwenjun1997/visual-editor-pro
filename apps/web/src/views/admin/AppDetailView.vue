<template>
  <div class="admin-page">
    <el-page-header title="应用管理" class="wa-mb-5" @back="router.push({ name: 'apps' })">
      <template #content>
        <span class="wa-text-base wa-font-medium">{{ app?.name || '应用详情' }}</span>
      </template>
      <template #extra>
        <el-button type="primary" @click="settingsVisible = true">配置底部导航</el-button>
      </template>
    </el-page-header>
    <el-card>
      <template #header>
        <div class="wa-flex wa-items-center wa-justify-between wa-gap-3">
          <span>页面管理</span>
          <div>
            <el-button size="small" type="primary" @click="createCustomPage">新建自定义页</el-button>
            <el-button size="small" @click="router.push({ name: 'apps' })">返回应用列表</el-button>
          </div>
        </div>
      </template>
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
    </el-card>
    <el-dialog v-model="settingsVisible" width="620px" title="底部导航配置">
      <p class="wa-mb-[18px] wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
        选择要显示的页面，并可修改导航名称和图标。导航最多显示 5 项。
      </p>
      <el-form v-if="editing" label-width="90px">
        <el-form-item label="显示导航"><el-switch v-model="editing.layout_config.showTabbar" /></el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="editing.layout_config.backgroundColor" />
        </el-form-item>
        <el-form-item label="激活颜色"><el-color-picker v-model="editing.layout_config.activeColor" /></el-form-item>
        <el-form-item label="未激活颜色">
          <el-color-picker v-model="editing.layout_config.inactiveColor" />
        </el-form-item>
        <el-form-item label="导航项目">
          <div class="wa-w-full">
            <div
              v-for="item in editing.layout_config.items"
              :key="item.key"
              class="wa-mb-2.5 wa-grid wa-grid-cols-[42px_120px_minmax(0,1fr)] wa-items-center wa-gap-2 last:wa-mb-0 lg:wa-grid-cols-[42px_120px_180px_minmax(0,1fr)_auto]"
            >
              <el-switch v-model="item.visible" />
              <el-input v-model="item.label" placeholder="名称" />
              <el-input v-model="item.icon" placeholder="图标类名，如 bi bi-house" />
              <el-select v-model="item.routeKey" placeholder="目标页面">
                <el-option
                  v-for="page in pages"
                  :key="page.id"
                  :label="page.title"
                  :value="page.route_key || page.slug"
                />
              </el-select>
              <el-button link type="danger" @click="removeNavItem(item.key)">移除</el-button>
            </div>
            <el-button v-if="editing.layout_config.items.length < 5" link type="primary" @click="addNavItem">
              + 添加导航页面
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveSettings">保存导航配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { appService, DEFAULT_LAYOUT } from '../../services/app.service'
import { pageService } from '../../services/page.service'
import type { AppRow, PageRow } from '../../types/api'
import { ElMessage, ElMessageBox } from 'element-plus'
const route = useRoute()
const router = useRouter()
const app = ref<AppRow | null>(null)
const pages = ref<PageRow[]>([])
const loading = ref(true)
const saving = ref(false)
const settingsVisible = ref(false)
const editing = ref<AppRow | null>(null)
const pageTypeLabels: Record<string, string> = {
  home: '首页',
  profile: '个人中心',
  'product-detail': '商品详情',
  'article-detail': '文章详情',
  custom: '自定义页面',
}
const cloneApp = (value: AppRow) => JSON.parse(JSON.stringify(value)) as AppRow
const ensureLayout = (value: AppRow) => {
  const result = cloneApp(value)
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
    const result = await appService.get(String(route.params.appId))
    app.value = result ? ensureLayout(result) : null
    pages.value = await appService.pages(String(route.params.appId))
    if (!app.value) ElMessage.error('应用不存在')
  } catch (error: any) {
    ElMessage.error(error?.message || '应用加载失败')
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(settingsVisible, (visible) => {
  if (visible && app.value) editing.value = ensureLayout(app.value)
})
const preview = async (row: PageRow) => {
  try {
    let context: Record<string, string> = {}
    if (row.page_type === 'product-detail' || row.page_type === 'article-detail') {
      const label = row.page_type === 'product-detail' ? '商品' : '文章'
      const result = await ElMessageBox.prompt(`请输入要预览的已发布${label} ID`, '选择预览数据', {
        inputPattern: /^[0-9a-f-]{36}$/i,
        inputErrorMessage: '请输入有效 UUID',
      })
      context = { entityId: result.value }
    }
    const token = await pageService.createPreviewToken(row.id, context)
    const origin = (import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000').replace(/\/$/, '')
    const popup = window.open(`${origin}/_preview/${token}`, '_blank', 'noopener,noreferrer')
    if (!popup) ElMessage.warning('预览窗口被浏览器拦截，请允许打开新窗口')
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '预览创建失败')
  }
}
const addNavItem = () => {
  if (!editing.value) return
  const routeKey = pages.value.find(
    (page) => !editing.value?.layout_config.items.some((item) => item.routeKey === (page.route_key || page.slug)),
  )?.route_key
  if (!routeKey) return ElMessage.info('没有可添加的页面')
  const page = pages.value.find((item) => (item.route_key || item.slug) === routeKey)
  editing.value.layout_config.items.push({
    key: `nav-${Date.now()}`,
    label: page?.title || '新页面',
    icon: 'bi bi-circle',
    routeKey,
    visible: true,
    sort: editing.value.layout_config.items.length,
  })
}
const removeNavItem = (key: string) => {
  if (editing.value)
    editing.value.layout_config.items = editing.value.layout_config.items.filter((item) => item.key !== key)
}
const saveSettings = async () => {
  if (!editing.value) return
  const visible = editing.value.layout_config.items.filter((item) => item.visible)
  if (visible.length > 5) return ElMessage.warning('底部导航最多显示 5 项')
  if (visible.some((item) => !pages.value.some((page) => page.route_key === item.routeKey)))
    return ElMessage.warning('导航目标页面不存在')
  saving.value = true
  try {
    await appService.update(editing.value.id, {
      layout_config: editing.value.layout_config,
      home_route_key: editing.value.home_route_key,
    })
    app.value = ensureLayout(editing.value)
    settingsVisible.value = false
    ElMessage.success('导航配置已保存')
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    saving.value = false
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
