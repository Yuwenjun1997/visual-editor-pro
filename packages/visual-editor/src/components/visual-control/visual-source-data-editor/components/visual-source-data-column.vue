<template>
  <div class="visual-source-data-column">
    <el-select
      v-model="modelValue.sourceId"
      filterable
      :loading="loading"
      style="width: 100%"
      placeholder="请选择数据源"
      @change="selectSource"
    >
      <el-option v-for="source in sources" :key="source.id" :value="source.id" :label="source.name" />
    </el-select>
    <p class="ve-mt-2 ve-text-xs ve-text-gray-400">仅显示与当前对象类型匹配的已配置数据源</p>
    <el-empty v-if="!loading && !sources.length" :image-size="56" description="暂无可用栏目数据，请先在管理端创建" />
  </div>
</template>

<script setup lang="ts">
import type { VisualSourceOptions } from '@visual/ui/types'
import { useVModel } from '@vueuse/core'
import { visualConfig } from '../../../../utils/visual.registry'
import type { VisualDataContract, VisualDataSource } from '../../../../types/visual-editor'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)
const sources = ref<VisualDataSource[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const contract = modelValue.value.dataContract as VisualDataContract | undefined
    sources.value =
      (await visualConfig.dataSourceProvider?.list(
        contract || (modelValue.value.customDataType === 'VisualObjectArray' ? 'list' : 'object'),
      )) || []
  } finally {
    loading.value = false
  }
}

const selectSource = (sourceId: string) => {
  modelValue.value.dataSource = 'managed'
  modelValue.value.sourceId = sourceId
  let source: { sourceKind?: 'entity_collection' | 'manual'; dataContract?: string } | undefined
  for (const item of sources.value as Array<{
    id: string
    sourceKind?: 'entity_collection' | 'manual'
    dataContract?: string
  }>) {
    if (item.id === sourceId) {
      source = item
      break
    }
  }
  modelValue.value.sourceKind = source?.sourceKind
  modelValue.value.dataContract = source?.dataContract
}

onMounted(load)
</script>

<style scoped></style>
