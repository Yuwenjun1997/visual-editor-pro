<template>
  <visual-box class="visual-image-text" :styles="_props.styles" :show-empty="_noListData">
    <div class="scroll-view-x">
      <div
        class="visual-image-text__inner"
        :class="_bindInnerClassList"
        :style="_bindInnerStyles"
      >
        <component
          class="visual-image-text-item"
          :is="_renderComponent"
          v-for="(item, index) in _props.listData"
          :key="index"
          :data="item"
          :showAuthor="_bindProps.showAuthor"
          :showTime="_bindProps.showTime"
        ></component>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualImageTextOne from './components/visual-image-text-one.vue'
import VisualImageTextTwo from './components/visual-image-text-two.vue'
import type {
  VisualImageTextCardItem,
  VisualImageTextCardProps,
} from './interface'
import { cssRadiusVar, cssSpacingVar } from '../../utils/styles.utils'

interface Props {
  props: VisualImageTextCardProps
  styles?: CSSProperties
  listData?: VisualImageTextCardItem[]
}

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed<VisualImageTextCardProps>(() => ({
  layout: 'col-1',
  cardStyle: 'simple',
  ..._props.props,
}))

const _renderComponent = computed(() => {
  if (_bindProps.value.cardStyle === 'partysu') return VisualImageTextTwo
  return VisualImageTextOne
})

const _innerWidth = computed(() => {
  return _props.listData.length * 320 + (_props.listData.length + 1) * 24
})

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-inner-width': `${_innerWidth.value}px`,
  '--v-inner-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--v-item-round': cssRadiusVar(_bindProps.value.round),
  '--v-cover-height': _bindProps.value.coverHeight,
}))

const _bindInnerClassList = computed(() => ({
  [`layout-item-card-${_bindProps.value.layout}`]: true,
}))
</script>

<style lang="scss" scoped>
.visual-image-text {
  &__inner {
    display: grid;
    gap: var(--v-inner-gutter);

    &.layout-item-card-col-1 {
      grid-template-columns: repeat(1, 1fr);
    }

    &.layout-item-card-col-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .visual-image-text-item {
      border-radius: var(--v-item-round);
      overflow: hidden;
    }

    &.layout-item-card-scroll-x {
      display: flex;
      width: var(--v-inner-width);

      .visual-image-text-item {
        display: inline-block;
      }
    }
  }
}
</style>
