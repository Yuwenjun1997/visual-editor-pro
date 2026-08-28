<template>
  <visual-box
    class="visual-product-list"
    :styles="_props.styles"
    :show-empty="_noListData"
    :class="_props.class"
  >
    <div class="visual-product-list__grid" :style="gridStyle">
      <visual-product-item
        v-for="(item, index) in _props.listData"
        :key="index"
        :data="item"
        :show-tag="_props.props.showTag"
        :show-buy="_props.props.showBuy"
        :button-text="_props.props.buttonText"
        :round="_props.props.round"
        :currency="_props.props.currency"
      />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualProductItem from '../visual-product-item/visual-product-item.vue'
import { cssSpacingVar } from '../../utils/styles.utils'
import type { VisualProductListProps, VisualProductListItem } from './interface'

interface Props {
  props: VisualProductListProps
  styles?: CSSProperties
  listData?: VisualProductListItem[]
  class?: string
}

defineOptions({
  name: 'VisualProductList',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)

const columns = computed(() => {
  const n = Math.round(Number(_props.props.columns) || 2)
  return Math.min(4, Math.max(1, n))
})

const gridStyle = computed<CSSProperties>(() => ({
  '--v-product-cols': String(columns.value),
  '--v-product-gutter': cssSpacingVar(_props.props.gutter),
}))
</script>

<style scoped lang="scss">
.visual-product-list {
  .visual-product-list__grid {
    display: grid;
    grid-template-columns: repeat(var(--v-product-cols, 2), 1fr);
    gap: var(--v-product-gutter, var(--v-spacing-base, 10px));
  }
}
</style>