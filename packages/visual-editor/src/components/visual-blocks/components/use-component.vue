<template>
  <component :is="componentName" v-bind="blockAttrs" :ref="(node: any) => registerRef(node, vid)">
    <template v-for="(_, key) in $slots" #[key] :key="key">
      <slot :name="key" />
    </template>
  </component>
  <div v-if="isOverlayComponent" class="overlay-placeholder">{{ props.block.label }}</div>
</template>

<script setup lang="ts">
import type { VisualBlockData } from '../../../types/visual-editor'
import { filterProps, filterStyles, VISUAL_OVERLAY_KEYS } from '../../../utils/visual.filter'
import { watch, type CSSProperties } from 'vue'
import { useVisualRef } from '../../../hooks/useVisualRef'
import { refreshColumnData, refreshManagedData } from '../../../utils/visual.data-source'
import type { VisualSourceOptions } from '@visual/ui/types'
import { useH5Runtime } from '@visual/ui'

interface Props {
  block: VisualBlockData
}

defineOptions({
  name: 'UseComponent',
})

const props = defineProps<Props>()

const { registerRef, getRef } = useVisualRef()
const runtime = useH5Runtime()

// 浮层组件不透传 list-data / styles（自样式、非列表驱动；teleport 根无法自动继承属性）：
const isOverlayComponent = computed(() => VISUAL_OVERLAY_KEYS.includes(props.block.key))

// 绑定值 undefined 仍会留在 $attrs 触发告警，故用 v-bind 对象整键省略
const blockAttrs = computed<Record<string, any>>(() =>
  isOverlayComponent.value
    ? { props: componentProps.value }
    : {
        ...(listData.value !== undefined ? { 'list-data': listData.value } : {}),
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
  return props.block.listData
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

const loadBlockData = () => {
  const blockRef = getRef(vid.value) as any
  const options = props.block.props?.options as VisualSourceOptions | undefined
  if (options?.dataSource === 'managed') {
    refreshManagedData(options, blockRef, runtime.$dataSource)
    return
  }
  if (options?.dataSource === 'column') {
    refreshColumnData(options, blockRef)
    return
  }
  if (blockRef && typeof blockRef.loadData === 'function') {
    blockRef?.loadData()
  }
}

onMounted(loadBlockData)

watch(
  () => {
    const options = props.block.props?.options as VisualSourceOptions | undefined
    return [options?.dataSource, options?.sourceId, options?.customDataType]
  },
  (next, previous) => {
    if (next.join('|') !== previous.join('|')) loadBlockData()
  },
)
</script>

<style scoped>
.overlay-placeholder {
  position: relative;
  min-height: 30px;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: var(--el-color-info-light-9);
}
</style>
