<template>
  <div
    :style="groupStyle"
    class="visual-page-renderer"
    :data-component-key="parentKey"
    :class="{ 'visual-page-renderer--root': !parentKey }"
  >
    <component :is="block.componentName" v-for="block in blocks" :key="block._vid" v-bind="blockAttrs(block)">
      <template v-for="(slot, name) in block.slots" #[name] :key="name">
        <VisualPageRenderer
          :blocks="slot.blocks"
          :parent-key="block.key"
          :parent-props="block.props"
          :parent-styles="block.styles"
        />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { VisualRuntimeBlock } from './interface'

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
  'list-data': block.listData || [],
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
