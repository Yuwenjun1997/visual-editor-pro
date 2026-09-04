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
      class="wa-grid wa-grid-cols-1 wa-gap-4 md:wa-grid-cols-2 xl:wa-grid-cols-3 2xl:wa-grid-cols-4"
    >
      <el-card v-for="app in apps" :key="app.id" shadow="hover">
        <div class="wa-flex wa-items-center wa-justify-between wa-gap-3">
          <div class="wa-flex wa-min-w-0 wa-items-center wa-gap-3">
            <div
              class="wa-grid wa-h-14 wa-w-14 wa-place-items-center wa-rounded-xl wa-bg-gradient-to-br wa-from-indigo-600 wa-to-blue-400 wa-text-[22px] wa-font-bold wa-text-white"
            >
              {{ app.name.slice(0, 1) }}
            </div>
            <div class="wa-min-w-0">
              <h3 class="wa-mb-1 wa-truncate wa-font-semibold">{{ app.name }}</h3>
              <el-tag :type="app.status === 'published' ? 'success' : app.status === 'offline' ? 'warning' : 'info'">
                {{ app.status === 'published' ? '已发布' : app.status === 'offline' ? '已下线' : '待发布' }}
              </el-tag>
            </div>
          </div>
          <el-dropdown trigger="hover" class="wa-mb-auto" placement="bottom-end" @command="handleAction($event, app)">
            <el-button link aria-label="更多操作" class="wa-h-7 wa-w-7 wa-shrink-0 wa-rounded-md wa-p-0">
              <Icon icon="ep:more-filled" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="snapshots">
                  <Icon class="wa-mr-1" icon="ep:collection" />
                  快照管理
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
        <p class="wa-my-4 wa-truncate wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">/{{ app.slug }}</p>
        <div class="wa-flex wa-items-center wa-border-t wa-border-[var(--el-border-color-lighter)] wa-pt-2.5">
          <el-button
            text
            type="primary"
            class="wa-flex-1"
            @click="router.push({ name: 'app-settings', params: { appId: app.id } })"
          >
            <Icon class="wa-mr-1" icon="ep:setting" />
            应用设置
          </el-button>
          <el-button text type="primary" class="wa-flex-1" @click="openDetail(app)">
            <Icon class="wa-mr-1" icon="ep:document" />
            页面管理
          </el-button>
          <el-button text type="primary" class="wa-flex-1" @click="previewApp(app)">
            <Icon icon="ep:view" class="wa-mr-1" />
            在线预览
          </el-button>
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
  </div>
</template>

<script setup lang="ts">
import { appService, normalizeAppSlug } from '../../services/app.service'
import type { AppRow } from '../../types/api'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '@iconify/vue'

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
</script>
