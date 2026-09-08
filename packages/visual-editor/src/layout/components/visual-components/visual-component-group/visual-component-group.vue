<template>
  <div class="visual-group">
    <div
      v-for="element in blocks"
      :key="element.span ? `span-${element.span}` : element.key"
      :data-name="element.span ? undefined : element.label"
      :class="[
        'visual-group-item',
        element.span ? ['ve-text-xs', 'more-components', `span-${element.span}`] : 'visual-drag-item',
      ]"
      @pointerdown="element.span ? undefined : onPointerDown(element, $event)"
    >
      <img v-if="element.span" src="/image/coding.svg" class="visual-group-item-preview" />
      <div v-else class="visual-group-item-label">
        <img :src="element.previewImage" class="visual-group-item-preview" />
        <div class="ve-text-center">{{ element.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useViusalStore } from '../../../../store/useVisual'
import type { VisualEditorComponent } from '../../../../types/visual-editor'
import { getActiveStageSandbox } from '../../../../components/visual-stage-sandbox/stage-sandbox-controller'

interface Props {
  list?: any[]
  group?: any
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  group: () => ({ name: 'visual', pull: 'clone', put: false }),
})

const visualStore = useViusalStore()

const onPointerDown = (block: VisualEditorComponent, event: PointerEvent) => {
  const started = getActiveStageSandbox()?.beginMaterialDrag(block, event)
  if (started) {
    event.preventDefault()
  } else {
    visualStore.clearMoveBlock()
  }
}

const blocks = computed(() => {
  const result = cloneDeep(unref(props.list))
  const remainder = result.length % 3
  if (remainder) result.push({ span: 3 - remainder })
  return result
})
</script>

<style scoped lang="scss">
.visual-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: var(--el-border-color);
  gap: 1px;
  border-top: 1px solid var(--el-border-color);

  .visual-group-item {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px;
    background-color: var(--el-bg-color);
    transition: var(--el-transition-all);

    &.more-components {
      flex-direction: row;
      color: var(--el-text-color-placeholder);

      img {
        width: 32px;
        height: 32px;
      }
    }

    .visual-group-item-preview {
      display: block;
      height: 48px;
    }

    .visual-group-item-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
    }

    &.visual-drag-item {
      cursor: move;
      touch-action: none;
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
