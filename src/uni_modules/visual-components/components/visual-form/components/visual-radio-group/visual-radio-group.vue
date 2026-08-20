<template>
  <div class="visual-radio-group">
    <ui-radio-group v-model="_boundValue" class="visual-radio-group__inner">
      <slot></slot>
    </ui-radio-group>
  </div>
</template>

<script setup lang="ts">
import RadioGroup from '../../../ui/radio-group/RadioGroup.vue'
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number | undefined
}

const _props = withDefaults(defineProps<Props>(), {})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
}>()

// 容器未传 v-model 时，内部自持选中态状态
const _internalValue = ref<string | number | undefined>(undefined)

const _boundValue = computed({
  get: () => (typeof _props.modelValue !== 'undefined' ? _props.modelValue : _internalValue.value),
  set: (value) => {
    _internalValue.value = value
    _emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss">
.visual-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-spacing-xs);
  padding: 0 var(--v-spacing-md);

  .visual-radio-group__inner {
    gap: var(--v-spacing-md);
  }
}
</style>
