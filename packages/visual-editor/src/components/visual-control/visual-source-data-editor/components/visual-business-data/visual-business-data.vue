<template>
  <div class="visual-business-data">
    <template v-if="provider">
      <el-form
        label-position="top"
        size="small"
      >
        <el-form-item label="数据类型">
          <el-radio-group v-model="businessType">
            <el-radio-button
              label="商品"
              value="products"
            />
            <el-radio-button
              label="文章"
              value="articles"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联分类">
          <el-select
            v-model="categoryId"
            v-loading="loadingCategories"
            placeholder="不选则载入全部"
            clearable
            filterable
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
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLoad"
          >
            载入数据
          </el-button>
          <span
            class="ve-ml-2 ve-text-xs"
            style="color: #909399"
          >
            载入当前数据管理中的记录,确认后生效于画布
          </span>
        </el-form-item>
      </el-form>
      <div
        v-if="modelValue.businessDataRef"
        class="ve-mt-2"
      >
        <div style="color: #67c23a; font-size: 12px">
          已绑定:{{
            modelValue.businessDataRef.businessType === 'products' ? '商品' : '文章'
          }}
          &nbsp;·&nbsp;{{ modelValue.businessDataRef.refType === 'all' ? '全部分类' : '分类数据' }}
        </div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px">
          页面保存时会用最新数据重新生成快照
        </div>
      </div>
    </template>
    <el-empty
      v-else
      description="未配置数据服务"
      :image-size="60"
    />
  </div>
</template>

<script setup lang="ts">
import type { VisualBusinessDataRef, VisualSourceOptions } from '@visual/ui/types'
import { visualConfig } from '../../../../../utils/visual.registry'
import { useVModel } from '@vueuse/core'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const provider = visualConfig.businessDataProvider

const businessType = ref<'products' | 'articles'>('products')
const categoryId = ref<string>('')
const categories = ref<{ id: string; name: string }[]>([])
const loadingCategories = ref(false)
const loading = ref(false)

const categoryType = computed<'product' | 'article'>(() =>
  businessType.value === 'products' ? 'product' : 'article',
)

const loadCategories = async () => {
  if (!provider) return
  loadingCategories.value = true
  categoryId.value = ''
  try {
    categories.value = await provider.listCategories(categoryType.value)
  } catch (error: any) {
    ElMessage.error(error?.message || '分类加载失败')
  } finally {
    loadingCategories.value = false
  }
}

watch(businessType, loadCategories, { immediate: true })

const handleLoad = async () => {
  if (!provider) return
  const ref: VisualBusinessDataRef = {
    businessType: businessType.value,
    refType: categoryId.value ? 'category' : 'all',
    refValue: categoryId.value || [],
  }
  loading.value = true
  try {
    const rows = await provider.resolveRows(ref)
    modelValue.value.dataSource = 'custom'
    modelValue.value.httpRequest = ''
    modelValue.value.httpMethod = undefined
    modelValue.value.httpRequestParams = undefined
    modelValue.value.httpRequestHeaders = undefined
    modelValue.value.httpResponseTransforms = undefined
    modelValue.value.columnKey = undefined
    modelValue.value.businessDataRef = ref
    modelValue.value.customJsonData =
      modelValue.value.customDataType === 'VisualObject'
        ? JSON.stringify(rows[0] ?? {})
        : JSON.stringify(rows)
    ElMessage.success(`已载入 ${rows.length} 条数据`)
  } catch (error: any) {
    ElMessage.error(error?.message || '数据载入失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
