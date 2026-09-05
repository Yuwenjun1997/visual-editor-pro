<template>
  <div class="admin-page">
    <el-page-header :content="route.params.id ? '编辑商品' : '新建商品'" @back="back" />
    <el-alert v-if="error" type="error" :title="error" class="wa-my-4" :closable="false">
      <el-button @click="load">重新加载</el-button>
    </el-alert>
    <el-card v-loading="loading" class="wa-mt-5">
      <ProductForm v-if="!loading && !error" v-model="form" :categories="categories" />
      <div class="wa-flex wa-justify-end wa-gap-3">
        <el-button @click="back">取消</el-button>
        <el-button type="primary" :loading="saving" :disabled="loading || !!error" @click="save">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProductForm from './components/ProductForm.vue'
import { useAuthStore } from '../../../stores/auth'
import { productService } from '../../../services/product.service'
import { categoryService } from '../../../services/category.service'
import type { CategoryRow } from '../../../types/api'
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const categories = ref<CategoryRow[]>([])
const saving = ref(false)
const loading = ref(true)
const error = ref('')
const baseline = ref('')
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
  html: '',
})
const back = () => router.push({ name: 'products', query: route.query })
const load = async () => {
  loading.value = true
  error.value = ''
  try {
    categories.value = (await categoryService.list()).filter((c) => c.type === 'product')
    if (route.params.id) {
      const row = await productService.get(String(route.params.id))
      if (!row) throw new Error('内容不存在或无权访问')
      for (const key of Object.keys(form))
        if (key in row) (form as Record<string, unknown>)[key] = (row as unknown as Record<string, unknown>)[key]
      form.html = row.content?.html || ''
    }
    baseline.value = JSON.stringify(form)
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}
onMounted(load)
const dirty = computed(() => !loading.value && !!baseline.value && baseline.value !== JSON.stringify(form))
onBeforeRouteLeave(async () => {
  if (!dirty.value) return true
  try {
    await ElMessageBox.confirm('修改尚未保存，确定离开吗？', '未保存修改', { type: 'warning' })
    return true
  } catch {
    return false
  }
})
const beforeUnload = (event: BeforeUnloadEvent) => {
  if (dirty.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
const save = async () => {
  if (saving.value) return
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
      category_id: form.category_id || null,
      status: form.status,
      sort: form.sort,
      description: form.description,
      content: { html: form.html },
    }
    if (route.params.id) {
      await productService.update(String(route.params.id), payload)
    } else {
      await productService.create({ ...payload, user_id: authStore.user.id })
    }
    ElMessage.success('保存成功')
    baseline.value = JSON.stringify(form)
    await back()
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    saving.value = false
  }
}
</script>
