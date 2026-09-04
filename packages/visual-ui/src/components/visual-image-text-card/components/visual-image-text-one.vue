<template>
  <a :href="href" class="visual-image-text-two" @click="handleClick">
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
          :author-name="_props.data.authorName"
          :author-avatar="_props.data.authorAvatar"
        />
        <visual-time v-if="_props.showTime" :time="_props.data.publishTime" />
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { VisualImageTextCardItem } from '../interface'
import VisualAuthor from './visual-author.vue'
import VisualTime from './visual-time.vue'
import { useH5Runtime, useH5RuntimeContext } from '../../../hooks/useH5Runtime'

interface Props {
  showAuthor?: boolean
  showTime?: boolean
  data: VisualImageTextCardItem
}

const _props = defineProps<Props>()
const runtime = useH5Runtime()
const runtimeContext = useH5RuntimeContext()
const href = computed(() => _props.data.link)
const handleClick = (event: MouseEvent) => {
  event.preventDefault()
  if (href.value) runtime.$navigateTo(href.value)
  else runtime.$emit('article:click', { item: _props.data }, { ...runtimeContext, interaction: 'click', item: _props.data, event })
}
</script>

<style scoped lang="scss">
@use '../../../assets/scss/utils/index.scss' as *;

.visual-image-text-two {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--v-surface-1);
  font-size: var(--v-text-md);

  .visual-image-text__cover {
    width: 100%;
    height: var(--v-cover-height, 150px);

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
    @include ellipsis(2);
    font-size: var(--v-text-md);
    line-height: 22px;
  }

  .visual-image-text__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
