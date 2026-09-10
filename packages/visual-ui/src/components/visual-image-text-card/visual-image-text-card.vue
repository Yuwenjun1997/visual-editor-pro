<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-image-text" :show-empty="_noListData">
    <div :style="_bindInnerStyles" class="visual-image-text__content">
      <visual-scroll-x v-if="_bindProps.layout === 'scroll-x'">
        <div v-for="(item, index) in _props.listData" :key="index" class="visual-image-text__slide">
          <component
            :is="_renderComponent"
            :data="item"
            class="visual-image-text-item"
            :show-time="_bindProps.showTime"
            :show-author="_bindProps.showAuthor"
            :background-color="_bindProps.backgroundColor"
          ></component>
        </div>
      </visual-scroll-x>
      <div v-else :class="_bindInnerClassList" class="visual-image-text__inner">
        <component
          :is="_renderComponent"
          v-for="(item, index) in _props.listData"
          :key="index"
          :data="item"
          class="visual-image-text-item"
          :show-time="_bindProps.showTime"
          :show-author="_bindProps.showAuthor"
          :background-color="_bindProps.backgroundColor"
        ></component>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualScrollX from '../visual-scroll-x/visual-scroll-x.vue'
import VisualImageTextOne from './components/visual-image-text-one.vue'
import VisualImageTextTwo from './components/visual-image-text-two.vue'
import type { VisualImageTextCardItem, VisualImageTextCardProps } from './interface'
import { cssRadiusVar, cssSpacingVar } from '../../utils/styles.utils'

interface Props {
  props: VisualImageTextCardProps
  styles?: CSSProperties
  listData?: VisualImageTextCardItem[]
  class?: string
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

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--visual-image-text-card-inner-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--visual-image-text-card-item-round': cssRadiusVar(_bindProps.value.round),
  '--visual-image-text-card-cover-height': _bindProps.value.coverHeight,
  '--visual-image-text-card-slide-width': _bindProps.value.cardWidth,
}))

const _bindInnerClassList = computed(() => ({
  [`layout-item-card-${_bindProps.value.layout}`]: true,
}))
</script>

<style scoped lang="scss">
.visual-image-text {
  .visual-image-text-item {
    border-radius: var(--visual-image-text-card-item-round);
    overflow: hidden;
  }

  &__inner {
    display: grid;
    gap: var(--visual-image-text-card-inner-gutter);

    &.layout-item-card-col-1 {
      grid-template-columns: repeat(1, 1fr);
    }

    &.layout-item-card-col-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__slide {
    flex: 0 0 var(--visual-image-text-card-slide-width, 320px);
    min-width: 0;
    margin-right: var(--visual-image-text-card-inner-gutter);
  }
}
</style>
