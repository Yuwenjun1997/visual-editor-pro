<template>
  <view class="visual-image-text-one" :class="_bindClassList">
    <view class="visual-image-text__cover">
      <image :src="_props.data.cover"></image>
    </view>
    <view class="visual-image-text__content">
      <view class="visual-image-text__body">
        {{ _props.data.title }}
      </view>
      <view class="visual-image-text__footer">
        <visual-author
          v-if="_props.showAuthor"
          :author-avatar="_props.data.authorAvatar"
          :author-name="_props.data.authorName"
        />
        <visual-time v-if="_props.showTime" :time="_props.data.publishTime" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { VisualImageTextListItem } from '../interface'
import VisualAuthor from './visual-author.vue'
import VisualTime from './visual-time.vue'

interface Props {
  showAuthor?: boolean
  showTime?: boolean
  data: VisualImageTextListItem
  corverInRight?: boolean
}

const _props = defineProps<Props>()

const _bindClassList = computed(() => ({
  'cover-in-right': _props.corverInRight,
}))
</script>

<style scoped lang="scss">
@import '../../../scss/utils/index.scss';

.visual-image-text-one {
  display: flex;
  align-items: center;
  height: 184rpx;
  background-color: #fff;
  font-size: var(--v-text-md);

  &.cover-in-right {
    flex-direction: row-reverse;
  }

  .visual-image-text__cover {
    width: 184rpx;
    height: 184rpx;
    flex-shrink: 0;

    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .visual-image-text__content {
    display: flex;
    flex-direction: column;
    padding: var(--v-spacing-md);
    gap: var(--v-spacing-sm);
    flex: 1;
  }

  .visual-image-text__body {
    height: 84rpx;
    @include ellipsis(2);
  }

  .visual-image-text__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
