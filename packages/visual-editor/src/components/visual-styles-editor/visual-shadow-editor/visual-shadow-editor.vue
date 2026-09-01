<template>
  <visual-collapse
    class="visual-margin-editor"
    title="阴影"
  >
    <template #right>
      <visual-color-input v-model="shadowColor" />
    </template>
    <template #default>
      <div class="ve-grid ve-grid-cols-2 ve-p-2 ve-gap-2 visual-input-group">
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="bi:box-arrow-right" />
          </div>
          <visual-px-input v-model="offsetX" />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="bi:box-arrow-down" />
          </div>
          <visual-px-input v-model="offsetY" />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="bi:droplet-half" />
          </div>
          <visual-px-input v-model="blurRadius" />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="bi:back" />
          </div>
          <visual-px-input v-model="spreadRadius" />
        </div>
      </div>
    </template>
  </visual-collapse>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '../../visual-collapse/visual-collapse.vue'
import VisualPxInput from '../../visual-control/visual-px-input/visual-px-input.vue'
import VisualColorInput from '../../visual-control/visual-color-input/visual-color-input.vue'
import type { CSSProperties } from 'vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: CSSProperties
}

defineOptions({
  name: 'VisualShadowEditor',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CSSProperties): void
}>()

const offsetX = ref<any>('')
const offsetY = ref<any>('')
const blurRadius = ref<any>('')
const spreadRadius = ref<any>('')
const shadowColor = ref<any>()

const useShadow = () =>
  typeof offsetX.value !== 'undefined' &&
  typeof offsetY.value !== 'undefined' &&
  typeof blurRadius.value !== 'undefined' &&
  typeof spreadRadius.value !== 'undefined' &&
  typeof shadowColor.value !== 'undefined'

const shadowOptions = computed<CSSProperties>(() => ({
  '--shadow-offset-x': offsetX.value,
  '--shadow-offset-y': offsetY.value,
  '--shadow-blur-radius': blurRadius.value,
  '--shadow-spread-radius': spreadRadius.value,
  '--shadow-shadow-color': shadowColor.value,
  boxShadow: useShadow()
    ? `var(--shadow-offset-x) var(--shadow-offset-y) var(--shadow-blur-radius) var(--shadow-spread-radius) var(--shadow-shadow-color)`
    : undefined,
}))

const cssRule = useVModel(props, 'modelValue', emit)

const resetHandler = () => {
  offsetX.value = cssRule.value['--shadow-offset-x']
  offsetY.value = cssRule.value['--shadow-offset-y']
  blurRadius.value = cssRule.value['--shadow-blur-radius']
  spreadRadius.value = cssRule.value['--shadow-spread-radius']
  shadowColor.value = cssRule.value['--shadow-shadow-color']
}

const isMounted = ref(false)

watchEffect(() => {
  if (!isMounted.value) {
    isMounted.value = true
    resetHandler()
  }
  Object.assign(cssRule.value, shadowOptions.value)
})
</script>

<style scoped lang="scss">
.visual-margin-editor {
  .visual-input-group {
    padding: 8px;
    background-color: var(--el-color-info-light-7);
  }
}
</style>
