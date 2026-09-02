<template>
  <div
    :style="groupStyle"
    class="preview-group"
    :data-component-key="parentKey"
    :class="{ 'preview-group--root': isRoot }"
  >
    <div v-for="element in blocks" :key="element._vid" class="preview-block">
      <use-component :block="element">
        <template v-for="(value, key) in element.slots" #[key] :key="key">
          <PreviewBlocks
            :blocks="value.blocks"
            :parent-key="element.key"
            :parent-props="element.props"
            :parent-styles="element.styles"
          />
        </template>
      </use-component>
    </div>
  </div>
</template>

<script setup lang="ts">
import UseComponent from '../visual-blocks/components/use-component.vue'
import type { VisualBlockData } from '../../types/visual-editor'
import { collectionProps, collectionStyles } from '../../utils/visual.filter'

defineOptions({
  name: 'PreviewBlocks',
})

interface Props {
  blocks: VisualBlockData[]
  parentKey?: string
  parentProps?: Record<string, any>
  parentStyles?: Record<string, any>
}

const props = defineProps<Props>()

const isRoot = computed(() => !props.parentKey)

// 复刻编辑器 visual-blocks：Flex 等容器的弹性布局属性从父块提升到子槽位的组容器上，
// 否则 use-component 已把 flexDirection/justifyContent 等从 props 过滤掉，预览中会退化为纵向堆叠
const groupStyle = computed(() => ({
  ...collectionStyles(props.parentKey, props.parentStyles),
  ...collectionProps(props.parentKey, props.parentProps),
}))
</script>

<style scoped lang="scss">
.preview-group[data-component-key='VisualFlex'] {
  display: flex;
}

.preview-block {
  flex: 1;
}
</style>
