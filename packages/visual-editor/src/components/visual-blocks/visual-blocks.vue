<template>
  <VueDraggable
    :ref="registerDropElement"
    v-model="moduleList"
    :animation="250"
    :style="bindStyle"
    class="visual-group"
    :group="props.group"
    :data-drop-id="dropId"
    :force-fallback="true"
    :fallback-on-body="true"
    :disabled="props.disabled"
    :data-component-key="parentKey"
    :data-disabled="props.disabled"
    :class="{ 'is-empty': isEmpty }"
    :data-component-name="parentLabel"
    :data-slot="isEmpty ? '组件拖拽到这里' : ''"
    fallback-class="visual-stage-sortable-fallback"
    @start="onStart"
    @end="onEnd($event)"
  >
    <div
      v-for="(element, index) in moduleList"
      :key="element._vid"
      class="visual-block"
      :data-block-key="element.key"
      :data-block-vid="element._vid"
      :data-block-name="element.label"
      :class="{
        'has-children': !isEmptySlots(element),
        'is-active': isCurrentBlock(element),
      }"
      @mousedown.stop="onMouseDown(element)"
      @click.stop="handleClick(element, index)"
    >
      <use-component :key="element._vid" :block="element">
        <template v-for="(value, key) in element.slots" #[key] :key="key">
          <visual-blocks
            v-model="value.blocks"
            v-model:is-drag="dragging"
            :slot-key="String(key)"
            :parent-component="element"
            :move-block="props.moveBlock"
            :group="getGroupOption(value)"
            :disabled="isDisabled(element)"
          />
        </template>
      </use-component>
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import UseComponent from './components/use-component.vue'
import type { VisualBlockData, VisualBlockSlotData } from '../../types/visual-editor'
import { useVModel } from '@vueuse/core'
import { useViusalStore } from '../../store/useVisual'
import { collectionProps, collectionStyles, VISUAL_OVERLAY_KEYS } from '../../utils/visual.filter'
import { useBlocks } from '../../hooks/useBlocks'
import { cloneDeep } from 'lodash'
import { notifyInternalDragEnd, registerDropTarget } from '../visual-stage-sandbox/drop-registry'
import { canAcceptBlock } from '../visual-stage-sandbox/stage-block-operations'

defineOptions({
  name: 'VisualBlocks',
})

interface Props {
  group?: any
  modelValue: VisualBlockData[]
  isDrag?: boolean
  parentComponent?: VisualBlockData
  disabled?: boolean
  moveBlock?: VisualBlockData | null
  slotKey?: string
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
const parentLabel = computed(() => props.parentComponent?.label)
const parentProps = computed(() => props.parentComponent?.props)
const parentStyles = computed(() => props.parentComponent?.styles)

const { setCurrentBlockPosition, clearCurrentBlockPosition } = useBlocks()
const visualStore = useViusalStore()

const moduleList = useVModel(props, 'modelValue', emit)
const dragging = useVModel(props, 'isDrag', emit)

const dropId = computed(() => `${props.parentComponent?._vid || 'root'}:${props.slotKey || 'root'}`)
const dropElement = ref<HTMLElement>()
let unregisterDropTarget: (() => void) | undefined

const registerDropElement = (value: any) => {
  const element = (value?.$el || value) as HTMLElement | undefined
  if (!element || element === dropElement.value) return
  dropElement.value = element
  unregisterDropTarget?.()
  unregisterDropTarget = registerDropTarget({
    dropId: dropId.value,
    element,
    parentVid: props.parentComponent?._vid,
    slotKey: props.slotKey,
    canAccept: (block) => {
      if (props.group.put === false || props.disabled) return false
      const slot = props.parentComponent && props.slotKey ? props.parentComponent.slots?.[props.slotKey] : undefined
      return !canAcceptBlock({ blocks: moduleList.value, parent: props.parentComponent, slot }, block)
    },
    getInsertIndex: (point) => {
      const children = Array.from(element.querySelectorAll<HTMLElement>(':scope > .visual-block'))
      for (let index = 0; index < children.length; index += 1) {
        const rect = children[index].getBoundingClientRect()
        if (point.y < rect.top + rect.height / 2) return index
      }
      return children.length
    },
  })
}

const onStart = () => {
  dragging.value = true
  visualStore.clearCurrent()
  clearCurrentBlockPosition()
}

const onEnd = (event: { item?: HTMLElement; to?: HTMLElement; newIndex?: number }) => {
  dragging.value = false
  visualStore.clearMoveBlock()
  const blockVid = event.item?.dataset.blockVid
  const dropId = event.to?.dataset.dropId
  if (blockVid && dropId && typeof event.newIndex === 'number') notifyInternalDragEnd(blockVid, dropId, event.newIndex)
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

onMounted(() => nextTick(() => registerDropElement(dropElement.value)))
onBeforeUnmount(() => unregisterDropTarget?.())

const handleClick = (block: VisualBlockData, index: number) => {
  visualStore.setCurrentBlock(block)
  setCurrentBlockPosition(index, moduleList.value, props.parentComponent)
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
  position: relative;

  &.is-empty {
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

    &[data-component-key] {
      &::after {
        content: attr(data-component-name);
        position: absolute;
        min-width: 80px;
        padding: 4px 0;
        border-radius: 0 0 8px 0;
        color: var(--el-text-color-secondary);
        text-align: center;
        background-color: var(--el-color-info-light-7);
        font-size: 10px;
      }
    }
  }

  &.is-drag .is-empty[data-disabled='true']::before {
    background-color: var(--el-disabled-bg-color) !important;
    opacity: 0.4 !important;
  }

  &.is-drop-target::after {
    position: absolute;
    inset: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--el-color-primary);
    content: '放入这里';
    pointer-events: none;
  }

  .visual-block {
    position: relative;
    z-index: 10;
    padding: 2px;
    outline: 1px dashed var(--el-border-color);
    outline-offset: -1px;
    cursor: move;

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

    &.is-drop-before,
    &.is-drop-after {
      --line-height: 12px;

      transition: all 0.2s;
    }

    &.is-drop-before {
      margin-top: var(--line-height);
    }

    &.is-drop-after {
      margin-bottom: var(--line-height);
    }

    &.is-drop-before::before,
    &.is-drop-after::after {
      height: 0;
      transition: all 0.2s;
    }

    &.is-drop-before::before,
    &.is-drop-after::after {
      transition: all 0.2s;
      position: absolute;
      right: 0;
      left: 0;
      z-index: 30;
      height: var(--line-height);
      content: '';
      background: var(--el-color-primary);
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.is-drop-before::before {
      top: calc(0px - var(--line-height));
    }
    &.is-drop-after::after {
      bottom: calc(0px - var(--line-height));
    }
  }
}

.visual-stage-sortable-fallback {
  opacity: 0 !important;
  pointer-events: none;
}
</style>
