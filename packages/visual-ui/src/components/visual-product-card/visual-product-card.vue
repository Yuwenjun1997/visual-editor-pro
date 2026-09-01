<template>
  <visual-box
    class="visual-product-card"
    :styles="_props.styles"
    :class="_props.class"
  >
    <visual-product-item
      :data="itemData"
      :layout="_props.props.layout"
      :show-tag="_props.props.showTag"
      :show-buy="_props.props.showBuy"
      :button-text="_props.props.buttonText"
      :round="_props.props.round"
      :currency="_props.props.currency"
    />
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualProductItem from '../visual-product-item/visual-product-item.vue'
import type { VisualProductItemData } from '../visual-product-item/interface'
import type { VisualProductCardProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualProductCardProps
  class?: string
}

defineOptions({
  name: 'VisualProductCard',
})

const _props = defineProps<Props>()

const itemData = computed<VisualProductItemData>(() => ({
  cover: _props.props.cover,
  title: _props.props.title,
  price: _props.props.price,
  originPrice: _props.props.originPrice,
  tag: _props.props.tag,
  buyLink: _props.props.buyLink,
}))
</script>
