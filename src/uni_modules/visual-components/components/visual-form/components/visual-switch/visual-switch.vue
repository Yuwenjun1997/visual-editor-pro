<template>
  <div class="visual-switch" :class="_bindClassList" :style="_bindStyles">
    <ui-switch
      class="visual-switch__inner"
      :checked="_checked"
      @update:checked="_handleCheckedChange"
    />
  </div>
</template>

<script setup lang="ts">
import Switch from '../../../ui/switch/Switch.vue'
import { computed } from 'vue'

interface Props {
  modelValue?: boolean | string | number
  trueValue?: boolean | string | number
  falseValue?: boolean | string | number
  size?: 'small' | 'medium' | 'large'
  activeColor?: string
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  trueValue: true,
  falseValue: false,
  activeColor: 'var(--v-primary-1)',
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string | number | undefined): void
}>()

const _checked = computed(() => _props.modelValue === _props.trueValue)

const _handleCheckedChange = (on: boolean | 'indeterminate') => {
  _emit('update:modelValue', on ? _props.trueValue : _props.falseValue)
}

const _bindClassList = computed(() => ({
  [`visual-switch--${_props.size}`]: true,
}))

const _bindStyles = computed(() => ({
  '--v-active-color': _props.activeColor,
}))
</script>

<style scoped lang="scss">
.visual-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  line-height: 1;
  padding: 0 var(--v-spacing-md);

  .visual-switch__inner {
    transform-origin: 0 center;
    transform: scale(0.9);
  }

  :deep([role='switch'][data-state='checked']) {
    background-color: var(--v-active-color) !important;
  }
}
</style>
