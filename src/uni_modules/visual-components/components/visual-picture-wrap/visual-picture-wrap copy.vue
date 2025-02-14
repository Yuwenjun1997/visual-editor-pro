<template>
  <visual-box
    class="visual-picture-wrap"
    :class="_bindClassList"
    :styles="_props.styles"
  >
    <!-- 普通列表 -->
    <template v-if="!_isScroll">
      <view class="visual-picture-wrap__inner" :style="_bindInnerStyles">
        <view
          class="visual-picture"
          v-for="(item, index) in _props.listData"
          :key="index"
        >
          <image class="visual-picture__image" :src="item.url" />
          <text class="visual-picture__label" v-if="_bindProps.showLabel">
            {{ item.label }}
          </text>
        </view>
      </view>
    </template>
    <!-- 滚动列表 -->
    <scroll-view scroll-x="true" v-else>
      <view class="visual-picture-wrap__inner" :style="_bindInnerStyles">
        <view
          class="visual-picture"
          v-for="(item, index) in _props.listData"
          :key="index"
        >
          <image class="visual-picture__image" :src="item.url" />
          <text class="visual-picture__label" v-if="_bindProps.showLabel">
            {{ item.label }}
          </text>
        </view>
      </view>
    </scroll-view>
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
}

defineOptions({
  name: 'VisualPictureWrap',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _bindProps = computed(() => ({ ..._props.props }))

const _isScroll = computed(() => _bindProps.value.listType === 'scroll')

const _bindClassList = computed(() => {
  return [`list-style-${_bindProps.value.listType}`]
})

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-picture-radius': cssSpacingVar(_bindProps.value.radius),
  '--v-picture-height': _bindProps.value.height,
  '--v-picture-gutter': cssSpacingVar(_bindProps.value.gutter),
  '--v-picture-bg-color': _bindProps.value.bgColor,
}))
</script>

<style lang="scss" scoped>
.visual-picture-wrap {
  .visual-picture-wrap__inner {
    gap: var(--v-picture-gutter);

    .visual-picture {
      position: relative;
      overflow: hidden;
      border-radius: var(--v-picture-radius);
      height: var(--v-picture-height, 240rpx);
      background-color: var(--v-picture-bg-color);

      .visual-picture__image {
        display: block;
        width: 100%;
        height: 100%;
      }

      .visual-picture__label {
        position: absolute;
        inset: 0;
      }
    }
  }

  &.list-style-one {
    .visual-picture-wrap__inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &.list-style-two {
    .visual-picture-wrap__inner {
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
  }

  &.list-style-three {
    .visual-picture-wrap__inner {
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
  }

  &.list-style-four {
    .visual-picture-wrap__inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      .visual-picture {
        &:nth-child(1) {
          grid-area: 1 / 1 / 2 / 3;
          height: calc(var(--v-picture-height, 240rpx) / 3 * 2);
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
  }

  &.list-style-scroll {
    .visual-picture-wrap__inner {
      display: flex;
      align-items: center;
      overflow: unset;

      .visual-picture {
        width: calc(var(--v-picture-height, 180rpx) * 1.75);
        height: var(--v-picture-height, 180rpx);
        flex-shrink: 0;
      }
    }
  }
}
</style>
