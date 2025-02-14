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
      <view
        class="visual-block"
        :class="{
          'has-children': !isEmptySlots(element),
          'is-active': isCurrentBlock(element),
        }"
        :data-block-name="element.label"
        @click.stop="handleClick(element, index)"
        @mousedown.stop="onMouseDown(element)"
      >
        <use-component :block="element" :key="element._vid">
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
      </view>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import UseComponent from './components/use-component.vue'
import type {
  VisualBlockData,
  VisualBlockSlotData,
} from '@/types/visual-editor'
import { useVModel } from '@vueuse/core'
import { useViusalStore } from '@/store/useVisual'
import { collectionProps, collectionStyles } from '@/utils/visual.filter'
import { useBlocks } from '@/hooks/useBlocks'
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

const checkedList = ['VisualObject', 'VisualObjectArray']
const isDisabled = (block: VisualBlockData): boolean => {
  if (!checkedList.includes(block.key)) return props.disabled
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

const bindStyle = computed(() => ({
  ...collectionStyles(parentKey.value, parentStyles.value),
  ...collectionProps(parentKey.value, parentProps.value),
}))
</script>

<style scoped lang="scss">
.visual-group {
  &.is-empty {
    position: relative;
    min-height: 160rpx;
    min-width: 200rpx;
    &::before {
      content: attr(data-slot);
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 24rpx;
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
      // &::after {
      //   content: attr(data-block-name);
      //   position: absolute;
      //   right: 0;
      //   top: 0;
      //   transform: translateX(100%);
      //   background-color: var(--el-color-primary);
      //   font-size: 12px;
      //   color: #fff;
      //   padding: 2px 8px;
      // }
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
