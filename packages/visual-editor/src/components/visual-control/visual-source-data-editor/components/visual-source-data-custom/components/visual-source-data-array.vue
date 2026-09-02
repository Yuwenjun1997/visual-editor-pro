<template>
  <div class="visual-source-data-array">
    <el-table border size="small" max-height="400" :data="tableData">
      <template v-for="column in schemaList" :key="column.propName">
        <el-table-column min-width="120" :label="column.label" :prop="column.propName">
          <template #default="{ row }">
            <el-input v-model="row[column.propName]" size="small" />
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="handleRemove($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" class="ve-w-full ve-mt-2" :disabled="!schemaList.length" @click="handleAdd">
      +添加一项
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useSchema } from '../../../../../../hooks/useSchema'
import type { VisualSourceOptions } from '@visual/ui/types'
import { formatJsonToObjectArray } from '@visual/ui/utils'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: VisualSourceOptions
}

type TableData = Record<string, any>

const props = defineProps<Props>()

const { schemaList } = useSchema()

const tableData = ref<TableData[]>([])

const handleAdd = () => {
  if (!schemaList.value.length) return
  const item = schemaList.value.reduce((prev, schema) => ({ ...prev, [schema.propName]: '' }), {})
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
  tableData.value = Array.isArray(jsonData) ? normalizeRows(jsonData) : []
}

const normalizeRows = (rows: TableData[]) =>
  rows.map((row) =>
    schemaList.value.reduce(
      (result, schema) => ({ ...result, [schema.propName]: row[schema.propName] ?? '' }),
      {} as TableData,
    ),
  )

watch(
  () => tableData,
  (data) => emitTableData(data.value),
  { deep: true },
)

onMounted(() => {
  resetTableData()
})

watch(schemaList, () => {
  tableData.value = normalizeRows(tableData.value)
})
</script>
