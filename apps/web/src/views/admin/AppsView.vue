<template>
  <div class="admin-page">
    <div class="wa-mb-4 wa-flex wa-items-center wa-justify-between">
      <div class="wa-text-base wa-font-medium">应用管理</div>
      <el-button type="primary" @click="createVisible = true">新建应用</el-button>
    </div>
    <el-empty v-if="!loading && !apps.length" description="还没有应用，先创建一个 H5 应用吧" />
    <div
      v-else
      v-loading="loading"
      class="wa-grid wa-grid-cols-1 wa-gap-4 sm:wa-grid-cols-2 lg:wa-grid-cols-3 xl:wa-grid-cols-4"
    >
      <el-card v-for="app in apps" :key="app.id" shadow="hover">
        <div class="wa-flex wa-items-center wa-gap-3">
          <div
            class="wa-grid wa-h-12 wa-w-12 wa-place-items-center wa-rounded-xl wa-bg-gradient-to-br wa-from-indigo-600 wa-to-blue-400 wa-text-[22px] wa-font-bold wa-text-white"
          >
            {{ app.name.slice(0, 1) }}
          </div>
          <div class="wa-min-w-0">
            <h3 class="wa-mb-2 wa-truncate wa-font-semibold">{{ app.name }}</h3>
            <el-tag
              size="small"
              :type="app.status === 'published' ? 'success' : app.status === 'offline' ? 'warning' : 'info'"
            >
              {{ app.status === 'published' ? '已发布' : app.status === 'offline' ? '已下线' : '草稿' }}
            </el-tag>
          </div>
        </div>
        <p class="wa-my-4 wa-truncate wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">/{{ app.slug }}</p>
        <div class="wa-flex wa-items-center wa-gap-2 wa-border-t wa-border-[var(--el-border-color-lighter)] wa-pt-2.5">
          <el-button text type="primary" class="wa-flex-1" @click="openDetail(app)">页面管理</el-button>
          <el-dropdown trigger="hover" placement="bottom-end" @command="handleAction($event, app)">
            <el-button link aria-label="更多操作" class="wa-h-7 wa-w-7 wa-rounded-md wa-p-0">
              <Icon icon="ep:more-filled" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <Icon class="wa-mr-1" icon="ep:setting" />
                  应用设置
                </el-dropdown-item>
                <el-dropdown-item command="pages">
                  <Icon class="wa-mr-1" icon="ep:document" />
                  页面管理
                </el-dropdown-item>
                <el-dropdown-item command="preview">
                  <Icon icon="ep:view" class="wa-mr-1" />
                  预览应用
                </el-dropdown-item>
                <el-dropdown-item v-if="app.status !== 'published'" command="publish">
                  <Icon class="wa-mr-1" icon="ep:upload" />
                  发布应用
                </el-dropdown-item>
                <el-dropdown-item v-else command="offline">
                  <Icon class="wa-mr-1" icon="ep:turn-off" />
                  下线应用
                </el-dropdown-item>
                <el-dropdown-item divided command="delete">
                  <Icon class="wa-mr-1" icon="ep:delete" />
                  删除应用
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="createVisible" width="460px" title="新建 H5 应用">
      <el-form label-width="90px">
        <el-form-item label="应用名称"><el-input v-model="form.name" placeholder="例如：我的品牌商城" /></el-form-item>
        <el-form-item label="应用标识">
          <el-input v-model="form.slug" placeholder="仅小写字母、数字和连字符" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="createApp">创建应用</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="settingsVisible" title="应用设置" width="560px">
      <el-form v-if="editing" label-width="110px">
        <el-form-item label="应用名称"><el-input v-model="editing.name" /></el-form-item>
        <el-form-item label="首页 RouteKey"><el-input v-model="editing.home_route_key" /></el-form-item>
        <el-form-item label="显示底部导航"><el-switch v-model="editing.layout_config.showTabbar" /></el-form-item>
        <el-form-item label="激活颜色"><el-color-picker v-model="editing.layout_config.activeColor" /></el-form-item>
        <el-form-item label="未激活颜色">
          <el-color-picker v-model="editing.layout_config.inactiveColor" />
        </el-form-item>
        <el-form-item label="导航项">
          <el-checkbox-group v-model="visibleTabs">
            <el-checkbox v-for="item in editing.layout_config.items" :key="item.key" :label="item.key">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { appService, normalizeAppSlug } from '../../services/app.service'
import type { AppRow } from '../../types/api'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '@iconify/vue'
import { pageService } from '../../services/page.service'

const router = useRouter()
const auth = useAuthStore()
const apps = ref<AppRow[]>([])
const loading = ref(true)
const saving = ref(false)
const createVisible = ref(false)
const settingsVisible = ref(false)
const editing = ref<AppRow | null>(null)
const visibleTabs = ref<string[]>([])
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
  if (command === 'settings') editApp(app)
  else if (command === 'pages') openDetail(app)
  else if (command === 'preview') previewApp(app)
  else if (command === 'publish') publishApp(app)
  else if (command === 'offline') offlineApp(app)
  else if (command === 'delete') removeApp(app)
}
const previewApp = async (app: AppRow) => {
  try {
    const pages = await appService.pages(app.id)
    const home =
      pages.find((page) => page.route_key === app.home_route_key) || pages.find((page) => page.is_home) || pages[0]
    if (!home) return ElMessage.warning('应用还没有可预览的页面')
    const origin = (import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000').replace(/\/$/, '')
    const href =
      app.status === 'published'
        ? `${origin}/apps/${app.slug}/${app.home_route_key}`
        : `${origin}/_preview/${await pageService.createPreviewToken(home.id)}`
    const popup = window.open(href, '_blank', 'noopener,noreferrer')
    if (!popup) ElMessage.warning('预览窗口被浏览器拦截，请允许打开新窗口')
  } catch (e: any) {
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
const editApp = (app: AppRow) => {
  editing.value = JSON.parse(JSON.stringify(app)) as AppRow
  visibleTabs.value = app.layout_config.items.filter((item) => item.visible).map((item) => item.key)
  settingsVisible.value = true
}
const saveSettings = async () => {
  if (!editing.value) return
  editing.value.layout_config.items = editing.value.layout_config.items.map((item) => ({
    ...item,
    visible: visibleTabs.value.includes(item.key),
  }))
  try {
    await appService.update(editing.value.id, {
      name: editing.value.name,
      home_route_key: editing.value.home_route_key,
      layout_config: editing.value.layout_config,
    })
    settingsVisible.value = false
    await load()
    ElMessage.success('设置已保存')
  } catch (e: any) {
    ElMessage.error(e.message || '保存失败')
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
</script>
