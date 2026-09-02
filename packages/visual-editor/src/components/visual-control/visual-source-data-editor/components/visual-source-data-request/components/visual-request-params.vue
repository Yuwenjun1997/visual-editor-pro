<template>
  <div class="visual-request-panel">
    <el-table border size="small" max-height="400" :data="modelValue.httpRequestParams">
      <el-table-column prop="key" label="Key">
        <template #default="{ row }">
          <el-input v-model="row.key" placeholder="Key" />
        </template>
      </el-table-column>
      <el-table-column prop="value" label="Value">
        <template #default="{ row }">
          <el-input v-model="row.value" placeholder="Value" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="handleRemove($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" class="ve-w-full" @click="handleAdd">+添加字段</el-button>
  </div>
</template>

<script setup lang="ts">
import type { VisualSourceOptions } from '@visual/ui/types'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const handleAdd = () => {
  if (!modelValue.value.httpRequestParams) {
    modelValue.value.httpRequestParams = []
  }
  modelValue.value.httpRequestParams.push({ key: '', value: '' })
}

const handleRemove = (index: number) => {
  if (!modelValue.value.httpRequestParams) return
  modelValue.value.httpRequestParams.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.visual-request-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
