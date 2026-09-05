<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium">页面列表</div>
      <div class="wa-flex">
        <el-button v-if="can('editor:access')" @click="router.push({ name: 'data-sources' })">数据源管理</el-button>
        <el-button v-if="can('page:create')" type="primary" @click="createPage">新建页面</el-button>
      </div>
    </div>
    <el-empty v-if="!loading && !pages.length" description="暂无页面" />
    <div
      v-loading="loading"
      class="wa-grid wa-grid-cols-1 wa-gap-4 sm:wa-grid-cols-2 lg:wa-grid-cols-3 xl:wa-grid-cols-4"
    >
      <el-card v-for="row in pages" :key="row.id" shadow="hover" class="wa-min-w-0 [--el-card-padding:16px]">
        <div class="wa-flex wa-items-start wa-justify-between wa-gap-3">
          <div class="wa-flex wa-min-w-0 wa-items-center wa-gap-2">
            <Icon icon="ep:document" class="wa-shrink-0 wa-text-[var(--el-color-primary)]" />
            <span class="wa-truncate wa-font-medium wa-text-[var(--el-text-color-primary)]">
              {{ row.title || '未命名页面' }}
            </span>
          </div>
          <div class="wa-flex wa-items-center wa-gap-2">
            <el-tag size="small" :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? (hasUnpublishedDraft(row) ? '已发布（有草稿）' : '已发布') : '草稿' }}
            </el-tag>
            <el-dropdown trigger="hover" placement="bottom-end" @command="handleAction($event, row)">
              <el-button
                link
                aria-label="更多操作"
                class="wa-h-7 wa-w-7 wa-rounded-md wa-p-0 wa-text-[var(--el-text-color-secondary)] hover:wa-bg-[var(--el-fill-color-light)] hover:wa-text-[var(--el-color-primary)]"
              >
                <Icon icon="ep:more-filled" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="can('page:edit')" command="edit">
                    <Icon icon="ep:edit" class="wa-mr-1" />
                    <span>编辑页面</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="preview">
                    <Icon icon="ep:view" class="wa-mr-1" />
                    <span>{{ row.status === 'published' ? '打开页面' : '预览草稿' }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="can('page:publish')" command="publish" :disabled="publishing === row.id">
                    <Icon class="wa-mr-1" icon="ep:upload" />
                    <span>{{ row.status === 'published' ? '再次发布' : '发布页面' }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="can('page:edit') && row.published_revision_id" command="revisions">
                    <Icon class="wa-mr-1" icon="ep:clock" />
                    <span>版本管理</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="can('page:delete')" divided command="delete">
                    <Icon class="wa-mr-1" icon="ep:delete" />
                    <span>删除页面</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="wa-mt-6 wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
          更新时间 {{ formatTime(row.updated_at) }}
        </div>
        <div class="wa-mt-1.5 wa-truncate wa-text-xs wa-text-[var(--el-text-color-secondary)]">
          公开地址：/p/{{ row.slug }}
        </div>
      </el-card>
    </div>
    <el-dialog v-model="revisionDialogVisible" title="页面版本" width="680px">
      <div v-loading="revisionLoading">
        <el-empty v-if="!revisionLoading && !revisions.length" description="暂无发布版本" />
        <el-table v-else row-key="id" :data="revisions">
          <el-table-column label="版本" width="90">
            <template #default="{ row }">v{{ row.version }}</template>
          </el-table-column>
          <el-table-column label="发布时间" min-width="180">
            <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template #default="{ row }">
              <el-button
                size="small"
                :disabled="row.id === revisionPage?.published_revision_id"
                @click="rollbackRevision(row.id)"
              >
                {{ row.id === revisionPage?.published_revision_id ? '当前版本' : '回滚' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { usePagesPage } from './composables/usePagesPage'
const {
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
} = usePagesPage()
</script>
