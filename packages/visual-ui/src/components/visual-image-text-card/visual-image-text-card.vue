<template>
  <visual-box
    class="visual-image-text"
    :styles="_props.styles"
    :show-empty="_noListData"
    :class="_props.class"
  >
    <div
      class="visual-image-text__content"
      :style="_bindInnerStyles"
    >
      <visual-scroll-x v-if="_bindProps.layout === 'scroll-x'">
        <div
          v-for="(item, index) in _props.listData"
          :key="index"
          class="visual-image-text__slide"
        >
          <component
            :is="_renderComponent"
            class="visual-image-text-item"
            :data="item"
            :show-author="_bindProps.showAuthor"
            :show-time="_bindProps.showTime"
          ></component>
        </div>
      </visual-scroll-x>
      <div
        v-else
        class="visual-image-text__inner"
        :class="_bindInnerClassList"
      >
        <component
          :is="_renderComponent"
          v-for="(item, index) in _props.listData"
          :key="index"
          class="visual-image-text-item"
          :data="item"
          :show-author="_bindProps.showAuthor"
          :show-time="_bindProps.showTime"
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
  '--v-inner-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--v-item-round': cssRadiusVar(_bindProps.value.round),
  '--v-cover-height': _bindProps.value.coverHeight,
  '--v-slide-width': _bindProps.value.cardWidth,
}))

const _bindInnerClassList = computed(() => ({
  [`layout-item-card-${_bindProps.value.layout}`]: true,
}))
</script>

<style scoped lang="scss">
.visual-image-text {
  .visual-image-text-item {
    border-radius: var(--v-item-round);
    overflow: hidden;
  }

  &__inner {
    display: grid;
    gap: var(--v-inner-gutter);

    &.layout-item-card-col-1 {
      grid-template-columns: repeat(1, 1fr);
    }

    &.layout-item-card-col-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__slide {
    flex: 0 0 var(--v-slide-width, 320px);
    min-width: 0;
    margin-right: var(--v-inner-gutter);
  }
}
</style>
