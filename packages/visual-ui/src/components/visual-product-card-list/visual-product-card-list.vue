<template>
  <visual-box :class="_props.class" :styles="_props.styles" :show-empty="_noListData" class="visual-product-card-list">
    <visual-scroll-x v-if="_bindProps.layout === 'scroll-x'">
      <div
        v-for="(item, index) in _props.listData"
        :key="index"
        :style="slideStyle"
        class="visual-product-card-list__slide"
      >
        <visual-product-item
          :data="item"
          :round="_props.props.round"
          :show-buy="_props.props.showBuy"
          :show-tag="_props.props.showTag"
          :currency="_props.props.currency"
          :button-text="_props.props.buttonText"
        />
      </div>
    </visual-scroll-x>
    <div v-else :style="gridStyle" :class="_gridClass" class="visual-product-card-list__grid">
      <visual-product-item
        v-for="(item, index) in _props.listData"
        :key="index"
        :data="item"
        :round="_props.props.round"
        :show-buy="_props.props.showBuy"
        :show-tag="_props.props.showTag"
        :currency="_props.props.currency"
        :button-text="_props.props.buttonText"
      />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualScrollX from '../visual-scroll-x/visual-scroll-x.vue'
import VisualProductItem from '../visual-product-item/visual-product-item.vue'
import { cssSpacingVar } from '../../utils/styles.utils'
import type { VisualProductCardListItem, VisualProductCardListProps } from './interface'

interface Props {
  props: VisualProductCardListProps
  styles?: CSSProperties
  listData?: VisualProductCardListItem[]
  class?: string
}

defineOptions({
  name: 'VisualProductCardList',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed<VisualProductCardListProps>(() => ({
  layout: 'col-2',
  ..._props.props,
}))

const _gridClass = computed(() => ({
  [`layout-product-card-${_bindProps.value.layout}`]: true,
}))

const gridStyle = computed<CSSProperties>(() => ({
  '--v-product-gutter': cssSpacingVar(_bindProps.value.gutter),
}))

const slideStyle = computed<CSSProperties>(() => ({
  '--v-slide-width': _bindProps.value.cardWidth,
}))
</script>

<style scoped lang="scss">
.visual-product-card-list {
  .visual-product-card-list__grid {
    display: grid;
    gap: var(--v-product-gutter);

    &.layout-product-card-col-1 {
      grid-template-columns: repeat(1, 1fr);
    }

    &.layout-product-card-col-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .visual-product-card-list__slide {
    flex: 0 0 var(--v-slide-width, 240px);
    min-width: 0;
    margin-right: var(--v-product-gutter);
  }
}
</style>
