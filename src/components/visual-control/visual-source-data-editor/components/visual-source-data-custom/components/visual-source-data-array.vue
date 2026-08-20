<template>
  <div class="visual-source-data-array">
    <el-table :data="tableData" size="small" border max-height="400">
      <template v-for="column in schemaList" :key="column.propName">
        <el-table-column
          :prop="column.propName"
          :label="column.label"
          min-width="120"
        >
          <template #default="{ row }">
            <el-input size="small" v-model="row[column.propName]" />
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" align="center" width="100">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="handleRemove($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="w-full mt-2" size="small" @click="handleAdd">
      +添加一项
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useSchema } from '@/hooks/useSchema'
import type { VisualSourceOptions } from '@/uni_modules/visual-components/types'
import { formatJsonToObjectArray } from '@/uni_modules/visual-components/utils'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: VisualSourceOptions
}

type TableData = Record<string, any>

const props = defineProps<Props>()

const { schemaList } = useSchema()

const tableData = ref<TableData[]>([])

const handleAdd = () => {
  const item = schemaList.value.reduce(
    (prev, schema) => ({ ...prev, [schema.propName]: '' }),
    {}
  )
  tableData.value.push(item)
}

const handleRemove = (index: number) => {
  tableData.value.splice(index, 1)
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const emitTableData = (data: TableData[]) => {
  modelValue.value.customJsonData = JSON.stringify(data)
}

const resetTableData = () => {
  const jsonData = formatJsonToObjectArray(modelValue.value.customJsonData)
  tableData.value = Array.isArray(jsonData) ? jsonData : []
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
