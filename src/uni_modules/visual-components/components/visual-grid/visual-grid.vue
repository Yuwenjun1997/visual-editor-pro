<template>
  <visual-box
    class="visual-grid"
    :styles="_props.styles"
    :show-empty="_noListData"
  >
    <view
      class="visual-grid__inner"
      :class="_bindClassList"
      :style="_bindInnerStyles"
    >
      <visual-grid-item
        v-for="(item, index) in _props.listData"
        :key="index"
        :text="item.text"
        :icon="item.icon"
        :icon-size="_bindProps.iconSize"
        :font-size="_bindProps.fontSize"
        :icon-color="_bindProps.iconColor"
        :font-color="_bindProps.fontColor"
        :direction="_bindProps.direction"
        :show-border="_bindProps.showBorder"
      />
    </view>
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

const _bindClassList = computed(() => ({
  'has-border': _bindProps.value.showBorder,
}))
</script>

<style scoped lang="scss">
.visual-grid {
  overflow: hidden;

  .visual-grid__inner {
    display: grid;
    position: relative;

    &.has-border {
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 1px solid var(--v-gray-6);
      }
    }
  }
}
</style>
