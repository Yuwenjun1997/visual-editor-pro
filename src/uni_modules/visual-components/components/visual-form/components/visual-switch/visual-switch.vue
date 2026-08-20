<template>
  <div class="visual-switch" :class="_bindClassList">
    <switch
      class="visual-switch__inner"
      :checked="_modelValue"
      :color="_props.activeColor"
      @change="_handleChange"
    />
  </div>
</template>

<script setup lang="ts">
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
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string | number | undefined): void
}>()

const _modelValue = computed({
  set: (value) => {
    _emit('update:modelValue', value ? _props.trueValue : _props.falseValue)
  },
  get: () => _props.modelValue === _props.trueValue,
})

const _bindClassList = computed(() => ({
  [`visual-switch--${_props.size}`]: true,
}))

const _handleChange = (e: any) => {
  _modelValue.value = e.detail.value
}
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
    transform: scale(0.53);
  }
}
</style>
