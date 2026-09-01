<template>
  <div
    class="visual-px-input"
    @click.stop
  >
    <el-input
      v-model="textValue"
      class="visual-px-input__input"
      :placeholder="props.placeholder"
      :type="type"
    />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { InputType } from 'element-plus'

interface Props {
  modelValue?: string
  placeholder?: string
  type?: InputType
}

defineOptions({
  name: 'VisualTextInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'input',
  type: 'text',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textValue = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss">
.visual-px-input {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2px;

  .visual-px-input__input {
    --el-input-border-radius: 0 !important;
  }
}
</style>
