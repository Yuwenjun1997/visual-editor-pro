<template>
  <div class="admin-page">
    <el-page-header title="应用管理" class="wa-mb-5" @back="router.push({ name: 'apps' })">
      <template #content>
        <span class="wa-text-base wa-font-medium">应用设置</span>
      </template>
      <template #extra>
        <el-button @click="navSettingsVisible = true">
          <Icon icon="ep:menu" class="wa-mr-1" />
          配置底部导航
        </el-button>
        <el-button @click="snapshotVisible = true">
          <Icon class="wa-mr-1" icon="ep:collection" />
          应用快照
        </el-button>
      </template>
    </el-page-header>

    <el-card v-loading="loading" class="wa-max-w-3xl">
      <template #header>
        <div>
          <div class="wa-text-base wa-font-medium">基础配置</div>
          <div class="wa-mt-1 wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
            配置应用名称和首页 RouteKey。
          </div>
        </div>
      </template>
      <el-empty v-if="!loading && !editing" description="应用不存在" />
      <el-form v-else-if="editing" label-width="110px" class="wa-max-w-2xl">
        <el-form-item label="应用名称"><el-input v-model="editing.name" /></el-form-item>
        <el-form-item label="首页 RouteKey"><el-input v-model="editing.home_route_key" /></el-form-item>
      </el-form>
      <template v-if="editing" #footer>
        <div class="wa-flex wa-justify-end">
          <el-button @click="router.push({ name: 'apps' })">取消</el-button>
          <el-button type="primary" :loading="saving" @click="saveSettings">保存设置</el-button>
        </div>
      </template>
    </el-card>
    <el-dialog v-model="snapshotVisible" title="应用快照" width="620px">
      <div class="wa-mb-3 wa-flex wa-justify-end">
        <el-button type="primary" @click="createSnapshot">
          <Icon icon="ep:plus" class="wa-mr-1" />
          添加快照
        </el-button>
      </div>
      <el-empty v-if="!snapshots.length" description="暂无快照" />
      <el-table v-else row-key="id" :data="snapshots">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" @click="restoreSnapshot(row as AppSnapshotRow)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="navSettingsVisible" width="620px" title="底部导航配置">
      <p class="wa-mb-[18px] wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
        选择要显示的页面，并可修改导航名称和图标。导航最多显示 5 项。
      </p>
      <el-form v-if="navEditing" label-width="90px">
        <el-form-item label="显示导航"><el-switch v-model="navEditing.layout_config.showTabbar" /></el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="navEditing.layout_config.backgroundColor" />
        </el-form-item>
        <el-form-item label="激活颜色"><el-color-picker v-model="navEditing.layout_config.activeColor" /></el-form-item>
        <el-form-item label="未激活颜色">
          <el-color-picker v-model="navEditing.layout_config.inactiveColor" />
        </el-form-item>
        <el-form-item label="导航项目">
          <div class="wa-w-full">
            <div
              v-for="item in navEditing.layout_config.items"
              :key="item.key"
              class="wa-mb-2.5 wa-grid wa-grid-cols-[42px_120px_minmax(0,1fr)] wa-items-center wa-gap-2 last:wa-mb-0 lg:wa-grid-cols-[42px_120px_180px_minmax(0,1fr)_auto]"
            >
              <el-switch v-model="item.visible" />
              <el-input v-model="item.label" placeholder="名称" />
              <el-input v-model="item.icon" placeholder="图标类名，如 bi bi-house" />
              <el-select v-model="item.routeKey" placeholder="目标页面">
                <el-option v-for="page in pages" :key="page.id" :label="page.title" :value="page.route_key || page.slug" />
              </el-select>
              <el-button link type="danger" @click="removeNavItem(item.key)">移除</el-button>
            </div>
            <el-button v-if="navEditing.layout_config.items.length < 5" link type="primary" @click="addNavItem">
              <Icon icon="ep:plus" class="wa-mr-1" />
              添加导航页面
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="navSettingsVisible = false">取消</el-button>
        <el-button type="primary" :loading="navSaving" @click="saveNavSettings">保存导航配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { appService, DEFAULT_LAYOUT } from '../../services/app.service'
import type { AppRow, AppSnapshotRow, PageRow } from '../../types/api'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const editing = ref<AppRow | null>(null)
const pages = ref<PageRow[]>([])
const snapshots = ref<AppSnapshotRow[]>([])
const snapshotVisible = ref(false)
const navSettingsVisible = ref(false)
const navSaving = ref(false)
const navEditing = ref<AppRow | null>(null)

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
    const app = await appService.get(String(route.params.appId))
    if (app) {
      const normalized = ensureLayout(app)
      editing.value = cloneApp(normalized)
      pages.value = await appService.pages(app.id)
      snapshots.value = await appService.snapshots(app.id)
      if (route.query.panel === 'snapshots') snapshotVisible.value = true
    }
  } catch (error: any) {
    ElMessage.error(error?.message || '应用加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

watch(navSettingsVisible, (visible) => {
  if (visible && editing.value) navEditing.value = ensureLayout(editing.value)
})

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
    await ElMessageBox.confirm(`确定恢复快照「${snapshot.name}」吗？当前应用信息将被覆盖。`, '恢复快照', { type: 'warning' })
    await appService.restoreSnapshot(snapshot)
    await load()
    ElMessage.success('快照已恢复')
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '快照恢复失败')
  }
}
const addNavItem = () => {
  if (!navEditing.value) return
  const routeKey = pages.value.find(
    (page) => !navEditing.value?.layout_config.items.some((item) => item.routeKey === (page.route_key || page.slug)),
  )?.route_key
  if (!routeKey) return ElMessage.info('没有可添加的页面')
  const page = pages.value.find((item) => (item.route_key || item.slug) === routeKey)
  navEditing.value.layout_config.items.push({
    key: `nav-${Date.now()}`,
    label: page?.title || '新页面',
    icon: 'bi bi-circle',
    routeKey,
    visible: true,
    sort: navEditing.value.layout_config.items.length,
  })
}
const removeNavItem = (key: string) => {
  if (navEditing.value)
    navEditing.value.layout_config.items = navEditing.value.layout_config.items.filter((item) => item.key !== key)
}
const saveNavSettings = async () => {
  if (!navEditing.value) return
  const visible = navEditing.value.layout_config.items.filter((item) => item.visible)
  if (visible.length > 5) return ElMessage.warning('底部导航最多显示 5 项')
  if (visible.some((item) => !pages.value.some((page) => page.route_key === item.routeKey)))
    return ElMessage.warning('导航目标页面不存在')
  navSaving.value = true
  try {
    await appService.update(navEditing.value.id, {
      layout_config: navEditing.value.layout_config,
      home_route_key: navEditing.value.home_route_key,
    })
    editing.value = ensureLayout(navEditing.value)
    navSettingsVisible.value = false
    ElMessage.success('导航配置已保存')
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    navSaving.value = false
  }
}

const saveSettings = async () => {
  if (!editing.value) return
  saving.value = true
  try {
    await appService.update(editing.value.id, {
      name: editing.value.name,
      home_route_key: editing.value.home_route_key,
    })
    ElMessage.success('设置已保存')
    router.push({ name: 'apps' })
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    saving.value = false
  }
}
</script>
