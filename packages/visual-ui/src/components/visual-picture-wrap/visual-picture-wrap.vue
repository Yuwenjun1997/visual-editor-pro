<template>
  <visual-box class="visual-picture-wrap" :styles="_props.styles" :show-empty="_noListData" :class="_props.class">
    <div class="scroll-view-x">
      <div
        class="visual-picture-wrap__inner"
        :class="_bindProps.layout"
        :style="_bindInnerStyles"
      >
        <div
          class="visual-picture"
          v-for="(item, index) in _props.listData"
          :key="index"
        >
          <img class="visual-picture__image" :src="item.url" />
          <span class="visual-picture__label" v-if="_bindProps.showLabel">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
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

const _innerWidth = computed(() => {
  return _props.listData.length * 320 + (_props.listData.length + 1) * 24
})

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-inner-width': `${_innerWidth.value}px`,
  '--v-picture-radius': cssSpacingVar(_bindProps.value.radius),
  '--v-picture-height': _bindProps.value.height,
  '--v-picture-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--v-picture-bg-color': _bindProps.value.bgColor,
}))
</script>

<style lang="scss" scoped>
@use '../../assets/scss/utils/index.scss' as *;

.visual-picture-wrap {
  .visual-picture-wrap__inner {
    gap: var(--v-picture-gutter);

    .visual-picture {
      position: relative;
      overflow: hidden;
      border-radius: var(--v-picture-radius);
      height: var(--v-picture-height, 120px);
      background-color: var(--v-picture-bg-color);

      .visual-picture__image {
        display: block;
        width: 100%;
        height: 100%;
      }

      .visual-picture__label {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 var(--v-spacing-sm);
        background-color: var(--v-black-opacity-6);
        color: var(--v-white);
        line-height: 24px;
        font-size: var(--v-text-md);
        @include ellipsis(1);
      }
    }
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
        height: calc(var(--v-picture-height, 120px) / 3 * 2);
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

  .layout-card-type-scroll-x {
    display: flex;
    width: var(--v-inner-width);

    .visual-picture {
      width: 180px;
      display: inline-block;
    }
  }
}
</style>
