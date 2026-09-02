<template>
  <div class="visual-normal-select">
    <el-select v-model="selectValue" clearable :placeholder="props.placeholder">
      <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import type { VisualSelectOption } from '../../../types/visual-editor'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
  options?: VisualSelectOption[]
}

defineOptions({
  name: 'VisualNormalSelect',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'select',
  options: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectValue = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss">
.visual-normal-select {
  max-width: 140px;
}
</style>
