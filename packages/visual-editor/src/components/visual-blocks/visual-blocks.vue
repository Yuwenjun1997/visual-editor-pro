<template>
  <draggable
    v-model="moduleList"
    item-key="_vid"
    class="visual-group"
    :class="{ 'is-empty': isEmpty }"
    :group="props.group"
    animation="250"
    :data-slot="isEmpty ? '组件拖拽到这里' : ''"
    :data-component-key="parentKey"
    :data-disabled="props.disabled"
    :style="bindStyle"
    :disabled="props.disabled"
    @start="onStart"
    @end="onEnd"
  >
    <template #item="{ element, index }">
      <div
        class="visual-block"
        :class="{
          'has-children': !isEmptySlots(element),
          'is-active': isCurrentBlock(element),
        }"
        :data-block-name="element.label"
        :data-block-key="element.key"
        @click.stop="handleClick(element, index)"
        @mousedown.stop="onMouseDown(element)"
      >
        <use-component
          :block="element"
          :is-design="isOverlayBlock(element)"
          :key="element._vid"
        >
          <template v-for="(value, key) in element.slots" #[key] :key="key">
            <visual-blocks
              v-model="value.blocks"
              v-model:isDrag="dragging"
              :parent-component="element"
              :move-block="props.moveBlock"
              :disabled="isDisabled(element)"
              :group="getGroupOption(value)"
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
import type {
  VisualBlockData,
  VisualBlockSlotData,
} from '../../types/visual-editor'
import { useVModel } from '@vueuse/core'
import { useViusalStore } from '../../store/useVisual'
import {
  collectionProps,
  collectionStyles,
  VISUAL_OVERLAY_KEYS,
} from '../../utils/visual.filter'
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

const { setCurrentBlockPosition, clearCurrentBlockPosition } = useBlocks()
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
  setCurrentBlockPosition(index, moduleList.value)
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
