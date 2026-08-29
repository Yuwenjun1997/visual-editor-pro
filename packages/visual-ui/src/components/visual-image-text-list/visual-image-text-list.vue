<template>
  <visual-box class="visual-image-text" :styles="_props.styles" :show-empty="_noListData" :class="_props.class">
    <div class="visual-image-text__inner" :style="_bindInnerStyles">
      <visual-image-text-one
        class="visual-image-text-item"
        v-for="(item, index) in _props.listData"
        :key="index"
        :data="item"
        :showAuthor="_bindProps.showAuthor"
        :showTime="_bindProps.showTime"
        :corver-in-right="_bindProps.coverInRight"
      ></visual-image-text-one>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualImageTextOne from './components/visual-image-text-one.vue'
import type {
  VisualImageTextListItem,
  VisualImageTextListProps,
} from './interface'
import { cssRadiusVar, cssSpacingVar } from '../../utils/styles.utils'

interface Props {
  props: VisualImageTextListProps
  styles?: CSSProperties
  listData?: VisualImageTextListItem[]
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed<VisualImageTextListProps>(() => ({
  layout: 'layout-item-list',
  cardStyle: 'simple',
  ..._props.props,
}))

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-inner-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--v-item-round': cssRadiusVar(_bindProps.value.round),
}))
</script>

<style scoped lang="scss">
.visual-image-text {
  &__inner {
    display: grid;
    gap: var(--v-inner-gutter);

    &.layout-item-list {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>