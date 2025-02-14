<template>
  <view class="visual-number-input" @click.stop>
    <el-input
      class="visual-number-input__input"
      v-model.number="modelValue"
      type="number"
      :placeholder="props.placeholder"
    />
  </view>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: number
  placeholder?: string
}

defineOptions({
  name: 'VisualTextInput',
})

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'input',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)
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
