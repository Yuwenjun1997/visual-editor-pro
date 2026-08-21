<template>
  <div class="visual-source-data-object">
    <el-table :data="tableData" size="small" border max-height="400">
      <el-table-column prop="label" label="属性名" width="120" />
      <el-table-column prop="propName" label="Key" width="120" />
      <el-table-column prop="value" label="Value">
        <template #default="{ row }">
          <el-input size="small" v-model="row.value" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useSchema } from '@/hooks/useSchema'
import { useVModel } from '@vueuse/core'
import { formatJsonToObject } from '#visual-ui/utils'
import type { CustomTableData } from '@/utils/visual.transform'
import {
  transformCustomJsonDataToTalbeData,
  transformTableDataToCustomJsonData,
} from '@/utils/visual.transform'
import type { VisualSourceOptions } from '#visual-ui/types'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const { schemaList } = useSchema()

const tableData = ref<CustomTableData[]>([])

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const emitTableData = (data: any[]) => {
  const jsonData = transformTableDataToCustomJsonData(data)
  modelValue.value.customJsonData = JSON.stringify(jsonData)
}

const resetTableData = () => {
  const jsonData = formatJsonToObject(modelValue.value.customJsonData)
  tableData.value = transformCustomJsonDataToTalbeData(
    schemaList.value,
    Array.isArray(jsonData) ? {} : jsonData
  )
}

watch(
  () => tableData,
  (data) => emitTableData(data.value),
  { deep: true }
)

onMounted(() => {
  resetTableData()
})
</script>

<style lang="scss" scoped>
.visual-source-data-object {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
