<template>
  <component
    :is="componentName"
    :list-data="listData"
    :props="componentProps"
    :styles="componentStyles"
    :ref="(node: any) => registerRef(node, vid)"
  >
    <template v-for="(_, key) in $slots" #[key] :key="key">
      <slot :name="key" />
    </template>
  </component>
</template>

<script setup lang="ts">
import type { VisualBlockData } from '@/types/visual-editor'
import { filterProps, filterStyles } from '@/utils/visual.filter'
import type { CSSProperties } from 'vue'
import { useVisualRef } from '@/hooks/useVisualRef'

interface Props {
  block: VisualBlockData
}

defineOptions({
  name: 'UseComponent',
})

const props = withDefaults(defineProps<Props>(), {})

const { registerRef, getRef } = useVisualRef()

// 注入数据
const slotObject = inject('slotObject', ref())
const slotObjectArray = inject('slotObjectArray', ref())

const vid = computed(() => props.block._vid)

// 组件名称
const componentName = computed(() => props.block.componentName)

const listData = computed(() => {
  if (slotObjectArray.value) return slotObjectArray.value
  return props.block.listData || []
})

// 组件属性
const componentProps = computed<Record<string, any>>(() => ({
  ...filterProps(props.block.key, props.block.props),
  ...slotObject.value,
}))

// 组件样式
const componentStyles = computed<CSSProperties>(() => {
  return filterStyles(props.block.key, props.block.styles)
})

onMounted(() => {
  const blockRef = getRef(vid.value) as any
  if (blockRef && typeof blockRef.loadData === 'function') {
    blockRef?.loadData()
  }
})
</script>
