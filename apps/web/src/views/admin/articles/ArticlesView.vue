<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium">文章管理</div>
      <div class="wa-flex wa-items-center wa-gap-3">
        <el-input v-model="keyword" clearable placeholder="搜索文章标题" style="width: 190px" @keyup.enter="query" />
        <el-select v-model="filterCategory" clearable placeholder="全部分类" style="width: 150px">
          <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
        </el-select>
        <el-select v-model="filterStatus" clearable placeholder="全部状态" style="width: 130px">
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
        </el-select>
        <div>
          <el-button @click="query">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="openCreate">新增文章</el-button>
        </div>
      </div>
    </div>

    <el-table v-loading="loading" :data="articles" empty-text="暂无文章">
      <el-table-column label="封面" width="90">
        <template #default="{ row }">
          <el-image v-if="row.cover_url" fit="cover" :src="row.cover_url" class="wa-w-14 wa-h-14 wa-rounded" />
          <div v-else class="wa-w-14 wa-h-14 wa-bg-gray-100 wa-rounded" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="180" />
      <el-table-column label="分类" width="110">
        <template #default="{ row }">
          {{ categoryName(row.category_id) || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" prop="author_name" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row as ArticleRow)">编辑</el-button>
          <el-button plain size="small" type="danger" @click="remove(row as ArticleRow)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="wa-flex wa-justify-end wa-mt-4">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="load"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleRow } from '../../../types/api'
import { useArticlesPage } from './composables/useArticlesPage'
const {
  articles,
  categories,
  keyword,
  filterCategory,
  filterStatus,
  page,
  pageSize,
  total,
  loading,
  categoryName,
  load,
  query,
  resetQuery,
  handleSizeChange,
  openCreate,
  openEdit,
  remove,
} = useArticlesPage()
</script>
