<template>
  <draggable
    v-model="moduleList"
    animation="250"
    item-key="_vid"
    :style="bindStyle"
    class="visual-group"
    :group="props.group"
    :disabled="props.disabled"
    :data-component-key="parentKey"
    :data-disabled="props.disabled"
    :class="{ 'is-empty': isEmpty }"
    :data-slot="isEmpty ? '组件拖拽到这里' : ''"
    @change="onChange"
    @end="onEnd"
    @start="onStart"
  >
    <template #item="{ element, index }">
      <div
        class="visual-block"
        :data-block-key="element.key"
        :data-block-name="element.label"
        :class="{
          'has-children': !isEmptySlots(element),
          'is-active': isCurrentBlock(element),
        }"
        @mousedown.stop="onMouseDown(element)"
        @click.stop="handleClick(element, index)"
      >
        <use-component :key="element._vid" :block="element" :is-design="isOverlayBlock(element)">
          <template v-for="(value, key) in element.slots" #[key] :key="key">
            <visual-blocks
              v-model="value.blocks"
              v-model:is-drag="dragging"
              :parent-component="element"
              :move-block="props.moveBlock"
              :group="getGroupOption(value)"
              :disabled="isDisabled(element)"
            />
          </template>
        </use-component>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import UseComponent from './components/use-component.vue'
import type { VisualBlockData, VisualBlockSlotData } from '../../types/visual-editor'
import { useVModel } from '@vueuse/core'
import { useViusalStore } from '../../store/useVisual'
import { collectionProps, collectionStyles, VISUAL_OVERLAY_KEYS } from '../../utils/visual.filter'
import { useBlocks } from '../../hooks/useBlocks'
import { cloneDeep } from 'lodash'

defineOptions({
  name: 'VisualBlocks',
})

interface Props {
  group?: Record<string, any>
  modelValue: VisualBlockData[]
  isDrag?: boolean
  parentComponent?: VisualBlockData
  disabled?: boolean
  moveBlock?: VisualBlockData | null
}
const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualBlockData[]): void
  (e: 'update:isDrag', value: boolean): void
}>()
const props = withDefaults(defineProps<Props>(), {
  isDrag: false,
  disabled: false,
  group: () => ({ name: 'visual', pull: true, put: true }),
})

const getGroupOption = (slot: VisualBlockSlotData) => ({
  name: 'visual',
  pull: true,
  put: typeof slot.size === 'undefined' || slot.blocks.length < slot.size,
})

const parentKey = computed(() => props.parentComponent?.key)
const parentProps = computed(() => props.parentComponent?.props)
const parentStyles = computed(() => props.parentComponent?.styles)

const { setCurrentBlockPosition, clearCurrentBlockPosition, clearParentDataSource } = useBlocks()
const visualStore = useViusalStore()

const moduleList = useVModel(props, 'modelValue', emit)
const dragging = useVModel(props, 'isDrag', emit)

const onStart = () => {
  dragging.value = true
  visualStore.clearCurrent()
  clearCurrentBlockPosition()
}

const onEnd = () => {
  dragging.value = false
  visualStore.clearMoveBlock()
}

const onChange = (event: { removed?: unknown }) => {
  if (event.removed) clearParentDataSource(props.parentComponent)
}

const isFlexDisabled = (block: VisualBlockData) => {
  if (block.key !== 'VisualFlex') return props.disabled
  if (!visualStore.moveBlock) return props.disabled
  return VISUAL_OVERLAY_KEYS.includes(visualStore.moveBlock.key)
}

const checkedList = ['VisualObject', 'VisualObjectArray']
const isDisabled = (block: VisualBlockData): boolean => {
  if (!checkedList.includes(block.key)) return isFlexDisabled(block)
  if (!visualStore.moveBlock) return props.disabled
  const souceDataType = visualStore.moveBlock.souceDataType
  return props.disabled || souceDataType !== block.key
}

const isEmpty = computed(() => moduleList.value.length === 0)
const isEmptySlots = (block: VisualBlockData) => {
  if (!block.slots) return true
  return Object.values(block.slots).every((slot) => slot.blocks.length === 0)
}

const onMouseDown = (block: VisualBlockData) => {
  visualStore.setMoveBlock(cloneDeep(block))
}

const handleClick = (block: VisualBlockData, index: number) => {
  visualStore.setCurrentBlock(block)
  setCurrentBlockPosition(index, moduleList.value, props.parentComponent)
}
const isCurrentBlock = (block: VisualBlockData) => {
  return block._vid === visualStore.vid
}
const isOverlayBlock = (block: VisualBlockData) => {
  return VISUAL_OVERLAY_KEYS.includes(block.key)
}

const bindStyle = computed(() => ({
  ...collectionStyles(parentKey.value, parentStyles.value),
  ...collectionProps(parentKey.value, parentProps.value),
}))
</script>

<style scoped lang="scss">
.visual-group {
  // 舞台页锚定容器：悬浮/浮层效果（absolute）锚定至此，而非浏览器视口
  position: relative;

  &.is-empty {
    position: relative;
    min-height: 60px;
    min-width: 100px;

    &::before {
      content: attr(data-slot);
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      background-color: var(--el-color-info-light-9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .visual-block {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 2px;
    outline: 1px dashed var(--el-border-color);
    cursor: move;
    z-index: 10;
    outline-offset: -1px;
    flex: 1;

    .visual-group {
      height: 100%;
    }

    &.has-children:hover {
      outline-color: var(--el-color-warning);
      outline-style: dotted;
    }

    &:hover {
      outline-color: var(--el-color-primary);
    }

    &.is-active {
      outline-color: var(--el-color-primary) !important;
      outline-style: solid !important;
      outline-width: 2px;
      outline-offset: -2px;
    }
  }
}
</style>
