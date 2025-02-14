<template>
  <view class="visual-image-text-two">
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
import type { VisualImageTextCardItem } from '../interface'
import VisualAuthor from './visual-author.vue'
import VisualTime from './visual-time.vue'

interface Props {
  showAuthor?: boolean
  showTime?: boolean
  data: VisualImageTextCardItem
}

const _props = defineProps<Props>()
</script>

<style scoped lang="scss">
@import '../../../scss/utils/index.scss';

.visual-image-text-two {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  font-size: var(--v-text-md);

  .visual-image-text__cover {
    width: 100%;
    height: var(--v-cover-height, 300rpx);

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
    @include ellipsis(2);
    font-size: var(--v-text-md);
    line-height: 44rpx;
  }

  .visual-image-text__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
