<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium">分类管理</div>
      <el-button type="primary" @click="openCreateDialog">添加分类</el-button>
    </div>

    <div class="wa-flex wa-items-center wa-gap-3 wa-mb-4">
      <el-radio-group v-model="typeFilter">
        <el-radio-button label="商品分类" value="product" />
        <el-radio-button label="文章分类" value="article" />
      </el-radio-group>
    </div>

    <el-table v-loading="loading" :data="visibleCategories">
      <el-table-column label="名称" prop="name" min-width="200" />
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          {{ row.type === 'product' ? '商品分类' : '文章分类' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="160">
        <template #default="{ row }">
          <el-input-number
            :min="0"
            size="small"
            :controls="false"
            :model-value="row.sort"
            @change="(v: any) => updateSort(row as CategoryRow, v)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button plain size="small" type="danger" @click="remove(row as CategoryRow)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="createDialogVisible" title="添加分类" width="420px" destroy-on-close>
      <el-form label-width="80px" @submit.prevent="create">
        <el-form-item label="分类类型">
          <el-radio-group v-model="newType">
            <el-radio-button label="商品分类" value="product" />
            <el-radio-button label="文章分类" value="article" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input
            v-model="newName"
            maxlength="40"
            show-word-limit
            placeholder="请输入分类名称"
            @keyup.enter="create"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="newSort" :min="0" :controls="false" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="create">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { CategoryRow } from '../../../types/api'
import { useCategoriesPage } from './composables/useCategoriesPage'
const {
  typeFilter,
  loading,
  saving,
  createDialogVisible,
  newName,
  newSort,
  newType,
  visibleCategories,
  openCreateDialog,
  create,
  updateSort,
  remove,
} = useCategoriesPage()
</script>
