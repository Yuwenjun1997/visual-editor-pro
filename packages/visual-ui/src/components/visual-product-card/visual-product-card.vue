<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-product-card">
    <visual-product-item
      :data="itemData"
      :round="_props.props.round"
      :layout="_props.props.layout"
      :show-buy="_props.props.showBuy"
      :show-tag="_props.props.showTag"
      :currency="_props.props.currency"
      :button-text="_props.props.buttonText"
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
