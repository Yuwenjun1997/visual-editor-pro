<template>
  <div class="visual-image-text-two">
    <div class="visual-image-text__header">
      <visual-author
        v-if="_props.showAuthor"
        :author-avatar="_props.data.authorAvatar"
        :author-name="_props.data.authorName"
      />
      <visual-time v-if="_props.showTime" :time="_props.data.publishTime" />
    </div>
    <div class="visual-image-text__content">
      <div class="visual-image-text__cover">
        <img :src="_props.data.cover"></img>
      </div>
      <div class="visual-image-text__body">
        {{ _props.data.title }}
      </div>
    </div>
  </div>
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
@use '../../../assets/scss/utils/index.scss' as *;

.visual-image-text-two {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--v-surface-1);
  font-size: var(--v-text-md);

  .visual-image-text__content {
    position: relative;

    .visual-image-text__cover {
      width: 100%;
      height: var(--v-cover-height, 150px);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .visual-image-text__body {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: var(--v-spacing-sm);
      background-color: var(--v-black-opacity-6);
      color: var(--v-white);
      font-size: var(--v-text-md);
      @include ellipsis(2);
    }
  }

  .visual-image-text__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--v-spacing-md);
    gap: var(--v-spacing-sm);
  }
}
</style>
