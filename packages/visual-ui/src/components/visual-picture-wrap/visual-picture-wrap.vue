<template>
  <visual-box :class="_props.class" :styles="_props.styles" :show-empty="_noListData" class="visual-picture-wrap">
    <div :style="_bindInnerStyles" class="visual-picture-wrap__content">
      <visual-scroll-x v-if="_bindProps.layout === 'layout-card-type-scroll-x'">
        <div v-for="(item, index) in _props.listData" :key="index" class="visual-picture visual-picture--slide">
          <img :src="item.url" class="visual-picture__image" />
          <span v-if="_bindProps.showLabel" class="visual-picture__label">
            {{ item.label }}
          </span>
        </div>
      </visual-scroll-x>
      <div v-else :class="_bindProps.layout" class="visual-picture-wrap__inner">
        <div v-for="(item, index) in _props.listData" :key="index" class="visual-picture">
          <img :src="item.url" class="visual-picture__image" />
          <span v-if="_bindProps.showLabel" class="visual-picture__label">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
import VisualScrollX from '../visual-scroll-x/visual-scroll-x.vue'
import type { CSSProperties } from 'vue'
import type { VisualPicture, VisualPictureWrapProps } from './interface'
import { cssSpacingVar } from '../../utils/styles.utils'

interface Props {
  props: VisualPictureWrapProps
  styles?: CSSProperties
  listData?: VisualPicture[]
  class?: string
}

defineOptions({
  name: 'VisualPictureWrap',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed(() => ({ ..._props.props }))

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--visual-picture-wrap-picture-radius': cssSpacingVar(_bindProps.value.radius),
  '--visual-picture-wrap-picture-height': _bindProps.value.height,
  '--visual-picture-wrap-picture-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--visual-picture-wrap-picture-bg-color': _bindProps.value.bgColor,
  '--visual-picture-wrap-slide-width': _bindProps.value.cardWidth,
}))
</script>

<style scoped lang="scss">
@use '../../assets/scss/utils/index.scss' as *;

.visual-picture-wrap {
  --visual-picture-wrap-spacing-sm: var(--v-spacing-sm);
  --visual-picture-wrap-black-opacity-6: var(--v-black-opacity-6);
  --visual-picture-wrap-white: var(--v-white);
  --visual-picture-wrap-text-md: var(--v-text-md);
  .visual-picture {
    position: relative;
    overflow: hidden;
    border-radius: var(--visual-picture-wrap-picture-radius);
    height: var(--visual-picture-wrap-picture-height, 120px);
    background-color: var(--visual-picture-wrap-picture-bg-color);

    .visual-picture__image {
      display: block;
      width: 100%;
      height: 100%;
    }

    .visual-picture__label {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 var(--visual-picture-wrap-spacing-sm);
      background-color: var(--visual-picture-wrap-black-opacity-6);
      color: var(--visual-picture-wrap-white);
      line-height: 24px;
      font-size: var(--visual-picture-wrap-text-md);
      @include ellipsis(1);
    }
  }

  .visual-picture-wrap__inner {
    gap: var(--visual-picture-wrap-picture-gutter);
  }

  .layout-card-type-one {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .layout-card-type-two {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .visual-picture {
      &:nth-child(1) {
        grid-area: 1 / 1 / 2 / 3;
      }

      &:nth-child(2) {
        grid-area: 2 / 1 / 3 / 2;
      }

      &:nth-child(3) {
        grid-area: 2 / 2 / 3 / 3;
      }
    }
  }

  .layout-card-type-three {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);

    .visual-picture {
      &:nth-child(1) {
        grid-area: 1 / 1 / 3 / 2;
        height: 100%;
      }

      &:nth-child(2) {
        grid-area: 1 / 2 / 2 / 3;
      }

      &:nth-child(3) {
        grid-area: 2 / 2 / 3 / 3;
      }
    }
  }

  .layout-card-type-four {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .visual-picture {
      &:nth-child(1) {
        grid-area: 1 / 1 / 2 / 3;
        height: calc(var(--visual-picture-wrap-picture-height, 120px) / 3 * 2);
      }

      &:nth-child(2) {
        grid-area: 2 / 1 / 4 / 2;
        height: 100%;
      }

      &:nth-child(3) {
        grid-area: 2 / 2 / 3 / 3;
      }

      &:nth-child(4) {
        grid-area: 3 / 2 / 4 / 3;
      }
    }
  }

  .visual-picture--slide {
    flex: 0 0 var(--visual-picture-wrap-slide-width, 200px);
    width: var(--visual-picture-wrap-slide-width, 200px);
    min-width: 0;
    margin-right: var(--visual-picture-wrap-picture-gutter);
  }
}
</style>
