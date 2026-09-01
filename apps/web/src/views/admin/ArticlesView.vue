<template>
  <div class="admin-page">
      <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
        <div class="wa-text-base wa-font-medium">文章管理</div>
        <el-button type="primary" @click="openCreate">新增文章</el-button>
      </div>

      <el-table :data="articles" v-loading="loading">
        <el-table-column label="封面" width="90">
          <template #default="{ row }">
            <el-image
              v-if="row.cover_url"
              :src="row.cover_url"
              fit="cover"
              class="wa-w-14 wa-h-14 wa-rounded"
            />
            <div v-else class="wa-w-14 wa-h-14 wa-bg-gray-100 wa-rounded" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column label="分类" width="110">
          <template #default="{ row }">
            {{ categoryName(row.category_id) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="author_name" label="作者" width="110" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              size="small"
              :type="row.status === 'published' ? 'success' : 'info'"
            >
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button size="small" @click="openEdit(row as ArticleRow)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="remove(row as ArticleRow)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? '编辑文章' : '新增文章'"
      width="640px"
      destroy-on-close
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="文章标题">
          <el-input v-model="form.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="封面图">
          <ImageUploader v-model="form.cover_url" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="form.category_id"
            clearable
            placeholder="不选分类"
            style="width: 100%"
          >
            <el-option
              v-for="c in categories"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author_name" placeholder="作者名" />
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="form.publish_time"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 160px">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="正文 HTML">
          <el-input
            v-model="form.html"
            type="textarea"
            :rows="5"
            placeholder="粘贴富文本 HTML,Paste 后可在页面用富文本组件展示"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import ImageUploader from '../../components/ImageUploader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import { categoryService } from '../../services/category.service'
import { articleService } from '../../services/article.service'
import type { ArticleRow, CategoryRow } from '../../types/api'

const authStore = useAuthStore()

const articles = ref<ArticleRow[]>([])
const categories = ref<CategoryRow[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editing = ref<ArticleRow | null>(null)
const saving = ref(false)

const form = reactive({
  title: '',
  cover_url: '',
  category_id: null as string | null,
  author_name: '',
  publish_time: null as string | null,
  status: 'draft' as 'draft' | 'published',
  summary: '',
  html: '',
})

const categoryName = (id: string | null) =>
  categories.value.find((c) => c.id === id)?.name

const load = async () => {
  loading.value = true
  try {
    const [articleData, categoryData] = await Promise.all([
      articleService.list(),
      categoryService.list(),
    ])
    articles.value = articleData
    categories.value = categoryData.filter((c) => c.type === 'article')
  } catch (error: any) {
    ElMessage.error(error?.message || '数据加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const resetForm = () => {
  Object.assign(form, {
    title: '',
    cover_url: '',
    category_id: null,
    author_name: '',
    publish_time: null,
    status: 'draft',
    summary: '',
    html: '',
  })
}

const openCreate = () => {
  editing.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: ArticleRow) => {
  editing.value = row
  Object.assign(form, {
    title: row.title || '',
    cover_url: row.cover_url || '',
    category_id: row.category_id,
    author_name: row.author_name || '',
    publish_time: row.publish_time,
    status: row.status,
    summary: row.summary || '',
    html: row.content?.html || '',
  })
  dialogVisible.value = true
}

const save = async () => {
  if (!form.title?.trim()) {
    ElMessage.warning('请输入文章标题')
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
      category_id: form.category_id,
      author_name: form.author_name,
      publish_time: form.publish_time,
      status: form.status,
      summary: form.summary,
      content: form.html ? { html: form.html } : {},
    }
    if (editing.value) {
      await articleService.update(editing.value.id, payload)
    } else {
      await articleService.create({ ...payload, user_id: authStore.user.id })
    }
    ElMessage.success(editing.value ? '已更新' : '已创建')
    dialogVisible.value = false
    load()
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async (row: ArticleRow) => {
  await ElMessageBox.confirm(`确定删除文章「${row.title}」吗?`, '删除确认', {
    type: 'warning',
  })
    .then(async () => {
      await articleService.remove(row.id)
      ElMessage.success('已删除')
      load()
    })
    .catch(() => {})
}
</script>
