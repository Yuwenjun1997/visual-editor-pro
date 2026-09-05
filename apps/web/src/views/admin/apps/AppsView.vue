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
import { Icon } from '@iconify/vue'
import { useAppsPage } from './composables/useAppsPage'
const { router, apps, loading, saving, createVisible, form, createApp, openDetail, handleAction, previewApp } =
  useAppsPage()
</script>
