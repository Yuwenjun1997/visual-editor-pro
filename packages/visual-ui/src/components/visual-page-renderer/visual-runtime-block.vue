<template>
  <div :style="styles">
    <component :is="componentName" v-bind="componentAttrs">
    <template v-for="(slot, name) in slots" #[name] :key="name">
      <VisualPageRenderer :blocks="slot.blocks" :parent-key="block.key" :parent-props="block.props" :parent-styles="block.styles" />
    </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { VisualRuntimeBlock } from './interface'
import { provideH5RuntimeContext } from '../../hooks/useH5Runtime'
import { inject, type Ref } from 'vue'
import VisualPageRenderer from './visual-page-renderer.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  block: VisualRuntimeBlock
  attrs: Record<string, any>
  componentName: string
  slots?: Record<string, { blocks: VisualRuntimeBlock[] }>
}>()

const styles = computed(() => props.attrs.styles)
const slotObject = inject<Ref<Record<string, any> | undefined> | undefined>('slotObject', undefined)
const slotObjectArray = inject<Ref<Array<Record<string, any>>> | undefined>('slotObjectArray', undefined)
const componentAttrs = computed(() => {
  const { styles: _styles, ...rest } = props.attrs
  return {
    ...rest,
    ...(slotObjectArray ? { listData: slotObjectArray.value } : {}),
    props: { ...(rest.props || {}), ...(slotObject?.value || {}) },
  }
})

provideH5RuntimeContext({
  block: { _vid: props.block._vid, key: props.block.key, componentName: props.block.componentName },
})
</script>
