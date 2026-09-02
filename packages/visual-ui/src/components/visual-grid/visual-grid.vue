<template>
  <visual-box class="visual-grid" :class="_props.class" :styles="_props.styles" :show-empty="_noListData">
    <div :style="_bindInnerStyles" class="visual-grid__inner">
      <visual-grid-item
        v-for="(item, index) in _props.listData"
        :key="index"
        :icon="item.icon"
        :text="item.text"
        :font-size="_bindProps.fontSize"
        :icon-size="_bindProps.iconSize"
        :direction="_bindProps.direction"
        :font-color="_bindProps.fontColor"
        :icon-color="_bindProps.iconColor"
      />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
import VisualGridItem from './visual-grid-item.vue'
import type { CSSProperties } from 'vue'
import type { VisualGridProps, VisualGridItemProps } from './interface'

interface Props {
  styles?: CSSProperties
  props: VisualGridProps
  listData: VisualGridItemProps[]
  class?: string
}

defineOptions({
  name: 'VisualGrid',
})

const _props = defineProps<Props>()

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed<VisualGridProps>(() => ({
  ..._props.props,
}))

const _bindInnerStyles = computed<CSSProperties>(() => ({
  gridTemplateColumns: `repeat(${_bindProps.value.columnNum}, 1fr)`,
}))
</script>

<style scoped lang="scss">
.visual-grid {
  overflow: hidden;

  .visual-grid__inner {
    display: grid;
    gap: var(--v-spacing-sm);
  }
}
</style>
