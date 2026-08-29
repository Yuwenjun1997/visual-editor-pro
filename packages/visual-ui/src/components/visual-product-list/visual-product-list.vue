<template>
  <visual-box
    class="visual-product-list"
    :styles="_props.styles"
    :show-empty="_noListData"
    :class="_props.class"
  >
    <div class="visual-product-list__inner" :style="innerStyles">
      <visual-product-item
        v-for="(item, index) in _props.listData"
        :key="index"
        class="visual-product-list__row"
        :class="_rowClass"
        :layout="'horizontal'"
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
import type {
  VisualProductListItem,
  VisualProductListProps,
} from './interface'

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

const _bindProps = computed<VisualProductListProps>(() => ({
  ..._props.props,
}))

const _rowClass = computed(() => ({
  'visual-product-list__row--reverse': _bindProps.value.coverInRight,
}))

const innerStyles = computed<CSSProperties>(() => ({
  '--v-inner-gutter': cssSpacingVar(_bindProps.value.gutter),
}))
</script>

<style scoped lang="scss">
.visual-product-list {
  .visual-product-list__inner {
    display: flex;
    flex-direction: column;
    gap: var(--v-inner-gutter);
  }

  .visual-product-list .visual-product-list__row--reverse {
    flex-direction: row-reverse;
  }
}
</style>