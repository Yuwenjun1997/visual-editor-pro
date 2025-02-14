<template>
  <draggable
    class="visual-group"
    :list="blocks"
    :group="group"
    :sort="false"
    :clone="cloneHandler"
    itemKey="key"
    :allbackOnBody="true"
    draggable=".visual-drag-item"
    @start="onStart"
    @end="onEnd"
  >
    <template #item="{ element }">
      <view
        v-if="element.span"
        class="visual-group-item text-xs more-components"
        :class="'span-' + element.span"
      >
        <image
          class="visual-group-item-preview"
          src="/static/image/coding.svg"
        />
      </view>
      <view
        v-else
        class="visual-group-item visual-drag-item"
        :data-name="element.label"
        @mousedown="onMouseDown(element)"
        @mouseup="onMouseUp"
      >
        <image class="visual-group-item-preview" :src="element.previewImage" />
        <view class="visual-group-item-label">{{ element.label }}</view>
      </view>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import { useViusalStore } from '@/store/useVisual'
import type { VisualEditorComponent } from '@/types/visual-editor'
import { createVisualBlock } from '@/utils/visual.utils'

interface Props {
  list?: any[]
  group?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  group: () => ({ name: 'visual', pull: 'clone', put: false }),
})

const visualStore = useViusalStore()

const onStart = () => {
  visualStore.isDrag = true
}

const onEnd = () => {
  visualStore.isDrag = false
  visualStore.clearMoveBlock()
}

const onMouseDown = (block: VisualEditorComponent) => {
  visualStore.setMoveBlock(createVisualBlock(block))
}

const onMouseUp = () => {
  visualStore.clearMoveBlock()
}

const cloneHandler = (original: VisualEditorComponent) => {
  return createVisualBlock(cloneDeep(original))
}

const blocks = computed(() => {
  const fillCount = 3 - (props.list.length % 3)
  const result = cloneDeep(unref(props.list))
  if (fillCount === 0) return result
  result.push({ span: fillCount })
  return result
})
</script>

<style scoped lang="scss">
.visual-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: var(--el-border-color);
  gap: 1px;

  .visual-group-item {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    padding: 6px;
    background-color: var(--el-bg-color);
    transition: var(--el-transition-all);

    &.more-components {
      flex-direction: row;
      color: var(--el-text-color-placeholder);
      gap: 8px;
      image {
        width: 30px;
        height: 30px;
      }
    }

    .visual-group-item-preview {
      display: block;
      width: 100%;
      height: 100%;
    }

    .visual-group-item-label {
      font-size: 12px;
    }

    &.visual-drag-item {
      cursor: move;
    }

    &.visual-drag-item:hover {
      background-color: var(--el-color-primary-light-9);
    }

    &.span-1 {
      grid-column: span 1 / span 1;
    }

    &.span-2 {
      grid-column: span 2 / span 2;
    }

    &.span-3 {
      grid-column: span 3 / span 3;
    }
  }
}
</style>
