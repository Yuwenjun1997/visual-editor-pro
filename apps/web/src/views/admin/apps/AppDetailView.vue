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
            size="small"
            @click="router.push({ name: 'editor-app-review', params: { appId: route.params.appId, pageId: row.id } })"
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
import type { PageRow } from '../../../types/api'
import { useAppDetailPage } from './composables/useAppDetailPage'
const {
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
} = useAppDetailPage()
</script>
