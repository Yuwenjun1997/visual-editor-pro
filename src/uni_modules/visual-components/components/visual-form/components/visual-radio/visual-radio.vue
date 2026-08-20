<template>
  <label class="visual-radio" :style="_bindStyles">
    <ui-radio-group-item class="visual-radio__item" :value="_itemValue" />
    <span class="visual-radio__label" v-if="_props.label">
      {{ _props.label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import RadioGroupItem from '../../../ui/radio-group/RadioGroupItem.vue'
import { computed } from 'vue'

interface Props {
  label?: string
  value?: string | number
  modelValue?: string | number
  activeColor?: string
}

const _props = withDefaults(defineProps<Props>(), {
  activeColor: 'var(--v-primary-1)',
})

const _itemValue = computed(() => String(_props.value ?? ''))

const _bindStyles = computed(() => ({
  '--v-active-color': _props.activeColor,
}))
</script>

<style scoped lang="scss">
.visual-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--v-spacing-xs);
  position: relative;
  line-height: 1;
  cursor: pointer;

  .visual-radio__label {
    font-size: var(--v-text-md);
  }

  :deep(.visual-radio__item[data-state='checked']) {
    border-color: var(--v-active-color);
  }

  :deep(.visual-radio__item[data-state='checked'] svg) {
    color: var(--v-active-color);
  }
}
</style>
