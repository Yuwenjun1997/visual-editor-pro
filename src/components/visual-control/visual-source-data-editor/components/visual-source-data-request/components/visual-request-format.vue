<template>
  <div class="visual-request-format">
    <template v-if="!emptySchema">
      <el-table size="small" border max-height="400" :data="tableData">
        <el-table-column label="字段名" prop="label">
          <template #default="{ row }">
            <el-select v-model="row.propName">
              <el-option
                v-for="schema in schemaList"
                :key="schema.propName"
                :label="schema.label"
                :value="schema.propName"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="字段Key" prop="propName">
          <template #default="{ row }">
            <el-input placeholder="属性名" v-model="row.propName" disabled>
              <template #prepend>$props.</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="映射值Value" prop="mapValue">
          <template #default="{ row }">
            <el-input placeholder="属性名" v-model="row.mapValue">
              <template #prepend>$data.</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template #default="{ $index }">
            <el-button size="small" type="danger" @click="handleRemove($index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="small" @click="handleAdd">+添加字段</el-button>
    </template>
    <el-empty v-else description="暂无需要映射的属性" />
  </div>
</template>

<script setup lang="ts">
import { useSchema } from '@/hooks/useSchema'
import type { VisualSourceOptions } from '#visual-ui/types'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: VisualSourceOptions
}

interface TableData {
  label: string
  propName: string
  mapValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const { schemaList, emptySchema } = useSchema()

const tableData = ref<TableData[]>([])

const handleAdd = () => {
  tableData.value.push({ label: '', propName: '', mapValue: '' })
}

const handleRemove = (index: number) => {
  tableData.value.splice(index, 1)
}

const emitTableData = (data: TableData[]) => {
  modelValue.value.httpResponseTransforms = data.map((item) => ({
    key: item.propName,
    value: item.mapValue,
  }))
}

watch(
  () => tableData,
  (data) => emitTableData(data.value),
  { deep: true }
)

onMounted(() => {
  const data = modelValue.value.httpResponseTransforms || []
  tableData.value = data.map((item) => {
    const schema = schemaList.value.find((schema) => {
      return schema.propName === item.key
    })
    return {
      label: schema?.label || '',
      propName: item.key,
      mapValue: item.value,
    }
  })
})
</script>

<style lang="scss" scoped>
.visual-request-format {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
