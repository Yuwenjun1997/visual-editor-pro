<template>
  <div
    :style="groupStyle"
    class="visual-page-renderer"
    :data-component-key="parentKey"
    :class="{ 'visual-page-renderer--root': !parentKey }"
  >
    <VisualRuntimeBlockRenderer
      v-for="block in blocks"
      :key="block._vid"
      :block="block"
      :slots="block.slots"
      :attrs="blockAttrs(block)"
      :component-name="block.componentName"
    />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { VisualRuntimeBlock } from './interface'
import VisualRuntimeBlockRenderer from './visual-runtime-block.vue'

defineOptions({ name: 'VisualPageRenderer' })

const props = withDefaults(
  defineProps<{
    blocks?: VisualRuntimeBlock[]
    parentKey?: string
    parentProps?: Record<string, any>
    parentStyles?: CSSProperties
  }>(),
  { blocks: () => [] },
)

const FLEX_PROPS = ['flexDirection', 'justifyContent', 'alignItems', 'gap']

const withoutFlexProps = (key: string, value: Record<string, any> = {}) =>
  key === 'VisualFlex'
    ? Object.fromEntries(Object.entries(value).filter(([name]) => !FLEX_PROPS.includes(name)))
    : value

const withoutFlexStyles = (key: string, value: CSSProperties = {}) =>
  key === 'VisualFlex'
    ? Object.fromEntries(Object.entries(value).filter(([name]) => !FLEX_PROPS.includes(name)))
    : value

const groupStyle = computed<CSSProperties>(() => {
  if (props.parentKey !== 'VisualFlex') return {}
  return {
    ...Object.fromEntries(Object.entries(props.parentProps || {}).filter(([name]) => FLEX_PROPS.includes(name))),
    ...Object.fromEntries(Object.entries(props.parentStyles || {}).filter(([name]) => FLEX_PROPS.includes(name))),
  }
})

const blockAttrs = (block: VisualRuntimeBlock) => ({
  ...(block.listData ? { listData: block.listData } : {}),
  ...(block.data ? { data: block.data } : {}),
  props: withoutFlexProps(block.key, block.props),
  styles: withoutFlexStyles(block.key, block.styles),
})
</script>

<style scoped>
.visual-page-renderer[data-component-key='VisualFlex'] {
  display: flex;
}
.visual-page-renderer > :deep(*) {
  flex: 1;
}
</style>
