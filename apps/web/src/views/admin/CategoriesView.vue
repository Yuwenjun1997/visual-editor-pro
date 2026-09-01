<template>
  <div class="admin-page">
    <div class="wa-text-base wa-font-medium wa-mb-4">分类管理</div>

    <div class="wa-flex wa-items-center wa-gap-3 wa-mb-4">
      <el-radio-group v-model="typeFilter">
        <el-radio-button
          label="商品分类"
          value="product"
        />
        <el-radio-button
          label="文章分类"
          value="article"
        />
      </el-radio-group>
      <el-input
        v-model="newName"
        placeholder="新分类名称"
        style="width: 200px"
        @keyup.enter="create"
      />
      <el-input-number
        v-model="newSort"
        :min="0"
        :controls="false"
        placeholder="排序"
        style="width: 90px"
      />
      <el-button
        type="primary"
        :loading="saving"
        @click="create"
      >
        新增
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="visibleCategories"
    >
      <el-table-column
        prop="name"
        label="名称"
        min-width="200"
      />
      <el-table-column
        label="类型"
        width="120"
      >
        <template #default="{ row }">
          {{ row.type === 'product' ? '商品分类' : '文章分类' }}
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        width="160"
      >
        <template #default="{ row }">
          <el-input-number
            :model-value="row.sort"
            :min="0"
            :controls="false"
            size="small"
            @change="(v: any) => updateSort(row as CategoryRow, v)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
      >
        <template #default="{ row }">
          <el-button
            size="small"
            type="danger"
            plain
            @click="remove(row as CategoryRow)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import { categoryService } from '../../services/category.service'
import type { CategoryRow } from '../../types/api'

const authStore = useAuthStore()

const typeFilter = ref<'product' | 'article'>('product')
const categories = ref<CategoryRow[]>([])
const loading = ref(false)
const saving = ref(false)
const newName = ref('')
const newSort = ref(0)

const visibleCategories = computed(() =>
  categories.value.filter((c) => c.type === typeFilter.value),
)

const load = async () => {
  loading.value = true
  try {
    categories.value = await categoryService.list()
  } catch (error: any) {
    ElMessage.error(error?.message || '分类加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const create = async () => {
  const name = newName.value.trim()
  if (!name) {
    ElMessage.warning('请输入分类名称')
    return
  }
  if (!authStore.user) {
    ElMessage.error('未登录')
    return
  }
  saving.value = true
  try {
    await categoryService.create({
      user_id: authStore.user.id,
      name,
      type: typeFilter.value,
      sort: newSort.value,
    })
    ElMessage.success('已创建')
    newName.value = ''
    newSort.value = 0
    load()
  } catch (error: any) {
    ElMessage.error(error?.message || '创建失败')
  } finally {
    saving.value = false
  }
}

const updateSort = async (row: CategoryRow, value: number) => {
  try {
    await categoryService.update(row.id, { sort: value || 0 })
  } catch (error: any) {
    ElMessage.error(error?.message || '排序更新失败')
    load()
  }
}

const remove = async (row: CategoryRow) => {
  await ElMessageBox.confirm(`确定删除分类「${row.name}」吗?`, '删除确认', {
    type: 'warning',
  })
    .then(async () => {
      await categoryService.remove(row.id)
      ElMessage.success('已删除')
      load()
    })
    .catch(() => {})
}
</script>
