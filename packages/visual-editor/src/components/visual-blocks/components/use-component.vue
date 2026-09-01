<template>
  <component
    :is="componentName"
    v-bind="blockAttrs"
    :ref="(node: any) => registerRef(node, vid)"
  >
    <template
      v-for="(_, key) in $slots"
      #[key]
      :key="key"
    >
      <slot :name="key" />
    </template>
  </component>
</template>

<script setup lang="ts">
import type { VisualBlockData } from '../../../types/visual-editor'
import { filterProps, filterStyles, VISUAL_OVERLAY_KEYS } from '../../../utils/visual.filter'
import type { CSSProperties } from 'vue'
import { useVisualRef } from '../../../hooks/useVisualRef'

interface Props {
  block: VisualBlockData
  isDesign?: boolean
}

defineOptions({
  name: 'UseComponent',
})

const props = withDefaults(defineProps<Props>(), { isDesign: false })

const { registerRef, getRef } = useVisualRef()

// 悬浮/浮层类组件：仅在编辑器设计态转发 isDesign，避免多余 fallthrough 属性
const isOverlayComponent = computed(() => VISUAL_OVERLAY_KEYS.includes(props.block.key))

// 浮层组件不透传 list-data / styles（自样式、非列表驱动；teleport 根无法自动继承属性）：
// 绑定值 undefined 仍会留在 $attrs 触发告警，故用 v-bind 对象整键省略
const blockAttrs = computed<Record<string, any>>(() =>
  isOverlayComponent.value
    ? { props: componentProps.value, 'is-design': props.isDesign }
    : {
        'list-data': listData.value,
        props: componentProps.value,
        styles: componentStyles.value,
      },
)

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
