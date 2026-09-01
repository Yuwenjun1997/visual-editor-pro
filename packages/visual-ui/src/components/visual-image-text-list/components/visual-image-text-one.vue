<template>
  <div
    class="visual-image-text-one"
    :class="_bindClassList"
  >
    <div class="visual-image-text__cover">
      <img :src="_props.data.cover" />
    </div>
    <div class="visual-image-text__content">
      <div class="visual-image-text__body">
        {{ _props.data.title }}
      </div>
      <div class="visual-image-text__footer">
        <visual-author
          v-if="_props.showAuthor"
          :author-avatar="_props.data.authorAvatar"
          :author-name="_props.data.authorName"
        />
        <visual-time
          v-if="_props.showTime"
          :time="_props.data.publishTime"
        />
      </div>
    </div>
  </div>
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
@use '../../../assets/scss/utils/index.scss' as *;

.visual-image-text-one {
  display: flex;
  align-items: center;
  height: 92px;
  background-color: var(--v-surface-1);
  border-radius: var(--v-item-round);
  font-size: var(--v-text-md);

  &.cover-in-right {
    flex-direction: row-reverse;
  }

  .visual-image-text__cover {
    width: 92px;
    height: 92px;
    flex-shrink: 0;

    img {
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
    height: 42px;
    @include ellipsis(2);
  }

  .visual-image-text__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
