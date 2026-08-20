<template>
  <div class="visual-source-data-custom">
    <template v-if="!emptySchema">
      <template v-if="modelValue.customDataType === 'VisualObject'">
        <visual-source-data-object v-model="modelValue" />
      </template>
      <template v-else-if="modelValue.customDataType === 'VisualObjectArray'">
        <visual-source-data-array v-model="modelValue" />
      </template>
    </template>
    <template v-else>
      <el-empty description="暂无数据" />
    </template>
  </div>
</template>

<script setup lang="ts">
import VisualSourceDataArray from './components/visual-source-data-array.vue'
import VisualSourceDataObject from './components/visual-source-data-object.vue'
import { useSchema } from '@/hooks/useSchema'
import type { VisualSourceOptions } from '@/uni_modules/visual-components/types'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const { emptySchema } = useSchema()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)
</script>
