<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium">商品管理</div>
      <div class="wa-flex wa-items-center wa-gap-3">
        <el-input v-model="keyword" clearable placeholder="搜索商品标题" style="width: 190px" @keyup.enter="query" />
        <el-select v-model="filterCategory" clearable size="default" placeholder="全部分类" style="width: 160px">
          <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
        </el-select>
        <el-select v-model="filterStatus" clearable placeholder="全部状态" style="width: 130px">
          <el-option label="已上架" value="published" />
          <el-option label="草稿" value="draft" />
          <el-option label="已下架" value="off" />
        </el-select>
        <div>
          <el-button @click="query">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="openCreate">新增商品</el-button>
        </div>
      </div>
    </div>

    <el-table v-loading="loading" :data="products" empty-text="暂无商品">
      <el-table-column label="封面" width="90">
        <template #default="{ row }">
          <el-image v-if="row.cover_url" fit="cover" :src="row.cover_url" class="wa-w-14 wa-h-14 wa-rounded" />
          <div v-else class="wa-w-14 wa-h-14 wa-bg-gray-100 wa-rounded" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="180" />
      <el-table-column label="售价" width="100">
        <template #default="{ row }">¥{{ row.price ?? '-' }}</template>
      </el-table-column>
      <el-table-column label="分类" width="110">
        <template #default="{ row }">
          {{ categoryName(row.category_id) || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            size="small"
            :type="row.status === 'published' ? 'success' : row.status === 'draft' ? 'info' : 'danger'"
          >
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row as ProductRow)">编辑</el-button>
          <el-button plain size="small" type="danger" @click="remove(row as ProductRow)">删除</el-button>
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
    <el-dialog v-model="dialogVisible" width="600px" destroy-on-close :title="editing ? '编辑商品' : '新增商品'">
      <el-form :model="form" label-width="90px">
        <el-form-item label="商品标题">
          <el-input v-model="form.title" placeholder="商品名称" />
        </el-form-item>
        <el-form-item label="封面图">
          <ImageUploader v-model="form.cover_url" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input-number v-model="form.price" :min="0" :precision="2" :controls="false" style="width: 180px" />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="form.origin_price" :min="0" :precision="2" :controls="false" style="width: 180px" />
        </el-form-item>
        <el-form-item label="角标文案">
          <el-input v-model="form.tag" placeholder="如:新品 / 热卖" />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="form.buy_link" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category_id" clearable placeholder="不选分类" style="width: 100%">
            <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 160px">
            <el-option label="已上架" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="下架" value="off" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :controls="false" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" :rows="3" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import ImageUploader from '../../components/ImageUploader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import { categoryService } from '../../services/category.service'
import { productService } from '../../services/product.service'
import type { CategoryRow, ProductRow } from '../../types/api'

const authStore = useAuthStore()

const products = ref<ProductRow[]>([])
const categories = ref<CategoryRow[]>([])
const keyword = ref('')
const filterCategory = ref<string>('')
const filterStatus = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const editing = ref<ProductRow | null>(null)
const saving = ref(false)

const form = reactive({
  title: '',
  cover_url: '',
  price: null as number | null,
  origin_price: null as number | null,
  tag: '',
  buy_link: '',
  category_id: null as string | null,
  status: 'published' as 'published' | 'draft' | 'off',
  sort: 0,
  description: '',
})

const categoryName = (id: string | null) => categories.value.find((c) => c.id === id)?.name

const statusText = (s: string) => (s === 'published' ? '已上架' : s === 'draft' ? '草稿' : '下架')

let loadSequence = 0
const load = async () => {
  const sequence = ++loadSequence
  loading.value = true
  try {
    const [productsData, categoryData] = await Promise.all([
      productService.list({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
        categoryId: filterCategory.value,
        status: filterStatus.value,
      }),
      categoryService.list(),
    ])
    if (sequence !== loadSequence) return
    products.value = productsData.items
    total.value = productsData.total
    categories.value = categoryData.filter((c) => c.type === 'product')
  } catch (error: any) {
    ElMessage.error(error?.message || '数据加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const query = () => {
  page.value = 1
  load()
}

const resetQuery = () => {
  keyword.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
  query()
}

watch([keyword, filterCategory, filterStatus], () => {
  page.value = 1
})

const handleSizeChange = () => {
  page.value = 1
  load()
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    cover_url: '',
    price: null,
    origin_price: null,
    tag: '',
    buy_link: '',
    category_id: null,
    status: 'published',
    sort: 0,
    description: '',
  })
}

const openCreate = () => {
  editing.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: ProductRow) => {
  editing.value = row
  Object.assign(form, {
    title: row.title || '',
    cover_url: row.cover_url || '',
    price: row.price,
    origin_price: row.origin_price,
    tag: row.tag || '',
    buy_link: row.buy_link || '',
    category_id: row.category_id,
    status: row.status,
    sort: row.sort,
    description: row.description || '',
  })
  dialogVisible.value = true
}

const save = async () => {
  if (!form.title?.trim()) {
    ElMessage.warning('请输入商品标题')
    return
  }
  if (!authStore.user) {
    ElMessage.error('未登录')
    return
  }
  saving.value = true
  try {
    const payload = {
      title: form.title.trim(),
      cover_url: form.cover_url,
      price: form.price,
      origin_price: form.origin_price,
      tag: form.tag,
      buy_link: form.buy_link,
      category_id: form.category_id,
      status: form.status,
      sort: form.sort,
      description: form.description,
    }
    if (editing.value) {
      await productService.update(editing.value.id, payload)
    } else {
      await productService.create({ ...payload, user_id: authStore.user.id })
    }
    ElMessage.success(editing.value ? '已更新' : '已创建')
    dialogVisible.value = false
    await load()
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async (row: ProductRow) => {
  await ElMessageBox.confirm(`确定删除商品「${row.title}」吗?`, '删除确认', {
    type: 'warning',
  })
    .then(async () => {
      await productService.remove(row.id)
      ElMessage.success('已删除')
      await load()
    })
    .catch(() => {})
}
</script>
