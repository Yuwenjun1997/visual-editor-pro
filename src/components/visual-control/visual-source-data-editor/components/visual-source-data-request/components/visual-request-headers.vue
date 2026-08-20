<template>
  <div class="visual-request-panel">
    <el-table
      size="small"
      border
      max-height="400"
      :data="modelValue.httpRequestHeaders"
    >
      <el-table-column label="Key" prop="key">
        <template #default="{ row }">
          <el-input placeholder="Key" v-model="row.key" />
        </template>
      </el-table-column>
      <el-table-column label="Value" prop="value">
        <template #default="{ row }">
          <el-input placeholder="Value" v-model="row.value" />
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
    <el-button class="w-full" size="small" @click="handleAdd">
      +添加字段
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { VisualSourceOptions } from '@/uni_modules/visual-components/types'
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
  if (!modelValue.value.httpRequestHeaders) {
    modelValue.value.httpRequestHeaders = []
  }
  modelValue.value.httpRequestHeaders.push({ key: '', value: '' })
}

const handleRemove = (index: number) => {
  if (!modelValue.value.httpRequestHeaders) return
  modelValue.value.httpRequestHeaders.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.visual-request-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
