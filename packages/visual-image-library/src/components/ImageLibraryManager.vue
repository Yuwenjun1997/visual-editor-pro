<template>
  <div class="image-library">
    <aside class="image-library__sidebar">
      <div class="image-library__sidebar-title">
        <span>图片分类</span>
        <el-button text circle size="small" title="新建一级分类" @click="createCategory(null)">
          <Icon icon="ep:plus" />
        </el-button>
      </div>
      <el-menu :default-active="selectedCategory" @select="selectCategory">
        <el-menu-item index="all">
          <Icon icon="ep:picture" />
          全部图片
        </el-menu-item>
        <el-menu-item index="uncategorized">
          <Icon icon="ep:folder-opened" />
          未分类
        </el-menu-item>
        <el-sub-menu v-for="category in roots" :key="category.id" :index="category.id">
          <template #title>
            <Icon icon="ep:folder" />
            <span>{{ category.name }}</span>
          </template>
          <el-menu-item :index="category.id" @contextmenu.prevent="editCategory(category)">
            {{ category.name }}
          </el-menu-item>
          <el-menu-item
            v-for="child in childrenOf(category.id)"
            :key="child.id"
            :index="child.id"
            @contextmenu.prevent="editCategory(child)"
          >
            {{ child.name }}
          </el-menu-item>
          <el-menu-item :index="`new:${category.id}`" @click="createCategory(category.id)">
            <Icon icon="ep:plus" />
            添加子分类
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      <p class="image-library__hint">右键分类可重命名或删除</p>
    </aside>
    <main class="image-library__content">
      <div class="image-library__toolbar">
        <el-button v-if="selectedAssets.length" plain type="danger" @click="removeSelected">
          批量删除（{{ selectedAssets.length }}）
        </el-button>
        <el-select
          v-model="uploadCategoryId"
          clearable
          placeholder="选择上传分类"
          class="image-library__upload-category"
        >
          <el-option v-for="category in categories" :key="category.id" :value="category.id" :label="category.name" />
        </el-select>
        <el-upload accept="image/*" :http-request="upload" :show-file-list="false">
          <el-button type="primary">
            <Icon icon="ep:upload" />
            上传图片
          </el-button>
        </el-upload>
        <el-input
          v-model="keyword"
          clearable
          placeholder="搜索图片名称"
          class="image-library__search"
          @input="scheduleSearch"
        >
          <template #prefix><Icon icon="ep:search" /></template>
        </el-input>
      </div>
      <div class="image-library__alert">
        <el-alert type="warning" :closable="false" title="删除图片会使商品、文章和页面中已保存的该图片 URL 失效。" />
      </div>
      <el-scrollbar class="image-library__list">
        <el-result v-if="libraryError" icon="error" title="图片库暂不可用" :sub-title="libraryError" />
        <el-skeleton v-else-if="loading" animated :rows="6" />
        <el-empty v-else-if="!assets.length" description="暂无图片，上传一张开始使用" />
        <div v-else class="image-library__grid">
          <article
            v-for="asset in assets"
            :key="asset.id"
            class="image-library__card"
            :class="{ 'is-selected': selectedIds.has(asset.id) }"
            @click="emit('select', asset)"
          >
            <el-checkbox
              class="image-library__check"
              :model-value="selectedIds.has(asset.id)"
              @click.stop
              @change="toggleAsset(asset)"
            />
            <el-image
              :alt="asset.name"
              :src="asset.thumbnailUrl"
              class="image-library__image"
              fit="cover"
              lazy
              preview-teleported
              :preview-src-list="[asset.url]"
              scroll-container=".image-library__list .el-scrollbar__wrap"
              @click.stop
            />
            <div class="image-library__meta">
              <strong :title="asset.name">{{ asset.name }}</strong>
              <span>{{ formatTime(asset.created_at) }} · {{ formatSize(asset.size) }}</span>
            </div>
            <div class="image-library__card-actions" @click.stop>
              <el-button plain size="small" @click="renameAsset(asset)">
                <Icon icon="ep:edit" />
                重命名
              </el-button>
              <el-button v-if="selectable" plain size="small" type="primary" @click="emit('select', asset)">
                <Icon icon="ep:circle-check" />
                选择
              </el-button>
            </div>
          </article>
        </div>
      </el-scrollbar>
      <div class="image-library__pagination">
        <el-pagination
          v-model:current-page="page"
          background
          :total="total"
          :page-size="pageSize"
          layout="prev, pager, next"
          @current-change="load"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ImageLibraryService } from '../service'
import type { ImageAsset, ImageAssetWithUrl, ImageCategory, ImageCategoryFilter } from '../types'

const props = withDefaults(defineProps<{ client: SupabaseClient; userId: string; selectable?: boolean }>(), {
  selectable: false,
})
const emit = defineEmits<{ select: [asset: ImageAssetWithUrl] }>()
const service = computed(() => new ImageLibraryService(props.client, props.userId))
const categories = ref<ImageCategory[]>([])
const assets = ref<ImageAssetWithUrl[]>([])
const selectedCategory = ref<ImageCategoryFilter>('all')
const uploadCategoryId = ref<string | null>(null)
const selectedIds = ref(new Set<string>())
const keyword = ref('')
const page = ref(1)
const pageSize = 20
const total = ref(0)
const loading = ref(false)
const libraryError = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
const roots = computed(() => categories.value.filter((item) => !item.parent_id))
const childrenOf = (parentId: string) => categories.value.filter((item) => item.parent_id === parentId)
const selectedAssets = computed(() => assets.value.filter((item) => selectedIds.value.has(item.id)))
const formatTime = (value: string) => new Date(value).toLocaleDateString('zh-CN')
const formatSize = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return '0 B'
  const units = ['B', 'KB', 'MB']
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
  const formattedValue = Number((value / 1024 ** unitIndex).toFixed(unitIndex ? 1 : 0))
  return `${formattedValue} ${units[unitIndex]}`
}

const getLibraryErrorMessage = (error: any) => {
  const text = `${error?.code || ''} ${error?.message || ''}`
  return /PGRST205|image_categories|image_assets|404/i.test(text)
    ? '图库数据表尚未部署，请先执行 apps/web/supabase/migrations/20260911090000_image_library.sql。'
    : error?.message || '图片库数据加载失败，请稍后重试。'
}
const loadCategories = async () => {
  try {
    categories.value = await service.value.listCategories()
  } catch (error: any) {
    libraryError.value = getLibraryErrorMessage(error)
  }
}
const load = async () => {
  loading.value = true
  try {
    const result = await service.value.listAssets({
      page: page.value,
      pageSize,
      keyword: keyword.value.trim(),
      category: selectedCategory.value,
    })
    assets.value = result.items
    total.value = result.total
    selectedIds.value = new Set()
  } catch (error: any) {
    libraryError.value = getLibraryErrorMessage(error)
  } finally {
    loading.value = false
  }
}
const resetAndLoad = () => {
  page.value = 1
  load()
}
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(resetAndLoad, 300)
}
const selectCategory = (value: string) => {
  if (value.startsWith('new:')) return
  selectedCategory.value = value
  uploadCategoryId.value = value !== 'all' && value !== 'uncategorized' ? value : null
  resetAndLoad()
}
const toggleAsset = (asset: ImageAsset) => {
  const next = new Set(selectedIds.value)
  if (next.has(asset.id)) next.delete(asset.id)
  else next.add(asset.id)
  selectedIds.value = next
}
const createCategory = async (parentId: string | null) => {
  const { value } = await ElMessageBox.prompt('请输入分类名称', parentId ? '添加子分类' : '添加分类', {
    inputPattern: /\S+/,
    inputErrorMessage: '分类名称不能为空',
  }).catch(() => ({ value: '' }))
  if (!value?.trim()) return
  try {
    await service.value.createCategory(value, parentId)
    await loadCategories()
    ElMessage.success('分类已创建')
  } catch (error: any) {
    ElMessage.error(error?.message || '创建失败')
  }
}
const editCategory = async (category: ImageCategory) => {
  const action = await ElMessageBox.confirm(`可重命名或删除分类「${category.name}」`, '管理分类', {
    confirmButtonText: '重命名',
    cancelButtonText: '删除',
    distinguishCancelAndClose: true,
  }).catch((reason) => reason)
  if (action === 'confirm') {
    const { value } = await ElMessageBox.prompt('请输入新名称', '重命名分类', { inputValue: category.name }).catch(
      () => ({ value: '' }),
    )
    if (value?.trim()) await service.value.renameCategory(category.id, value)
  } else if (action === 'cancel') {
    await ElMessageBox.confirm('删除分类及子分类后，其中图片将移入未分类，确定继续吗？', '删除确认', {
      type: 'warning',
    })
    await service.value.removeCategory(category.id)
    if (selectedCategory.value === category.id) selectedCategory.value = 'all'
  } else return
  await loadCategories()
  await load()
}
const renameAsset = async (asset: ImageAsset) => {
  const { value } = await ElMessageBox.prompt('请输入图片名称', '重命名图片', { inputValue: asset.name }).catch(() => ({
    value: '',
  }))
  if (!value?.trim()) return
  try {
    await service.value.renameAsset(asset.id, value)
    await load()
    ElMessage.success('名称已更新')
  } catch (error: any) {
    ElMessage.error(error?.message || '更新失败')
  }
}
const upload = async ({ file }: { file: File }) => {
  try {
    await service.value.upload(file, uploadCategoryId.value)
    ElMessage.success('上传成功')
    await load()
  } catch (error: any) {
    ElMessage.error(error?.message || '上传失败')
  }
}
const removeSelected = async () => {
  await ElMessageBox.confirm('删除后所有已保存的图片 URL 将失效，确定删除吗？', '删除确认', { type: 'warning' })
  try {
    await service.value.removeAssets(selectedAssets.value)
    await load()
    ElMessage.success('已删除')
  } catch (error: any) {
    ElMessage.error(error?.message || '删除失败')
  }
}
watch(
  () => props.userId,
  async () => {
    await loadCategories()
    await resetAndLoad()
  },
)
onMounted(async () => {
  await loadCategories()
  await load()
})
onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
.image-library {
  display: flex;
  min-height: 520px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  overflow: hidden;
  background: var(--el-bg-color);
}
.image-library__sidebar {
  width: 210px;
  flex: none;
  padding: 12px;
  border-right: 1px solid var(--el-border-color-light);
}
.image-library__sidebar-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 8px;
  font-weight: 600;
}
.image-library__sidebar :deep(.el-menu) {
  border-right: 0;
}
.image-library__sidebar :deep(.el-menu-item),
.image-library__sidebar :deep(.el-sub-menu__title) {
  height: 36px;
  line-height: 36px;
}
.image-library__hint {
  margin: 10px 8px 0;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.image-library__content {
  min-width: 0;
  flex: 1;
}
.image-library__toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 16px 16px 0;
}
.image-library__upload-category {
  width: 150px;
}
.image-library__search {
  margin-left: auto;
  max-width: 250px;
}
.image-library__alert {
  margin: 12px 16px;
}
.image-library__list {
  height: 400px;
  padding: 0 16px;
}
.image-library__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}
.image-library__card {
  position: relative;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}
.image-library__card.is-selected {
  border-color: var(--el-color-primary);
}
.image-library__image {
  display: block;
  width: 100%;
  height: 120px;
  background: var(--el-fill-color-light);
  object-fit: cover;
}
.image-library__check {
  position: absolute;
  z-index: 1;
  top: 8px;
  left: 8px;
}
.image-library__meta {
  padding: 8px;
}
.image-library__meta strong,
.image-library__meta span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.image-library__meta span {
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.image-library__card-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 6px 5px;
}
.image-library__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
@media (max-width: 640px) {
  .image-library {
    display: block;
  }
  .image-library__sidebar {
    width: auto;
    border-right: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }
  .image-library__toolbar {
    flex-wrap: wrap;
  }
  .image-library__search {
    margin-left: 0;
    max-width: none;
  }
  .image-library__list {
    height: 420px;
  }
}
</style>
