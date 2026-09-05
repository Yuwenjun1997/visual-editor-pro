<template>
  <div class="admin-page">
    <el-page-header title="应用管理" class="wa-mb-5" @back="router.push({ name: 'apps' })">
      <template #content>
        <span class="wa-text-base wa-font-medium">应用设置</span>
      </template>
      <template #extra>
        <el-button @click="snapshotVisible = true">
          <Icon class="wa-mr-1" icon="ep:collection" />
          应用快照
        </el-button>
      </template>
    </el-page-header>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础配置" name="basic">
        <div v-loading="loading">
          <el-empty v-if="!loading && !editing" description="应用不存在" />
          <BasicSettings v-else-if="editing" v-model="editing" :pages="pages" :page-key="pageKey">
            <el-card>
              <div class="wa-flex wa-justify-end wa-gap-3">
                <el-button @click="router.push({ name: 'apps' })">取消</el-button>
                <el-button type="primary" :loading="saving" @click="saveSettings">保存设置</el-button>
              </div>
            </el-card>
          </BasicSettings>
        </div>
      </el-tab-pane>
      <el-tab-pane name="login" label="登录页面配置">
        <LoginSettings v-if="editing" v-model="editing.login_config">
          <el-card>
            <div class="wa-flex wa-justify-end wa-gap-3">
              <el-button @click="router.push({ name: 'apps' })">取消</el-button>
              <el-button type="primary" :loading="saving" :disabled="!editing" @click="saveSettings">
                保存设置
              </el-button>
            </div>
          </el-card>
        </LoginSettings>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="snapshotVisible" title="应用快照" width="620px">
      <div class="wa-mb-3 wa-flex wa-justify-end">
        <el-button size="small" type="primary" @click="createSnapshot">
          <Icon icon="ep:plus" class="wa-mr-1" />
          添加快照
        </el-button>
      </div>
      <el-empty v-if="!snapshots.length" description="暂无快照" />
      <el-table v-else row-key="id" :data="snapshots">
        <el-table-column label="名称" prop="name" min-width="180" />
        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button size="small" @click="restoreSnapshot(row as AppSnapshotRow)">恢复</el-button>
            <el-button plain size="small" type="danger" @click="removeSnapshot(row as AppSnapshotRow)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import BasicSettings from './components/BasicSettings.vue'
import LoginSettings from './components/LoginSettings.vue'
import type { AppSnapshotRow } from '../../../types/api'
import { Icon } from '@iconify/vue'
import { useAppSettingsPage } from './composables/useAppSettingsPage'
const {
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
} = useAppSettingsPage()
</script>
