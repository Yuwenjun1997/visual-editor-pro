<template>
  <a :href="href" :style="cardStyle" class="visual-image-text-two" @click="handleClick">
    <div class="visual-image-text__header">
      <visual-author
        v-if="_props.showAuthor"
        :author-name="_props.data.authorName"
        :author-avatar="_props.data.authorAvatar"
      />
      <visual-time v-if="_props.showTime" :time="_props.data.publishTime" />
    </div>
    <div class="visual-image-text__content">
      <div class="visual-image-text__cover">
        <img :src="_props.data.cover" />
      </div>
      <div class="visual-image-text__body">
        {{ _props.data.title }}
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useTheme } from '../../../hooks/useTheme'
import type { VisualImageTextCardItem } from '../interface'
import VisualAuthor from './visual-author.vue'
import VisualTime from './visual-time.vue'
import { useH5Runtime, useH5RuntimeContext } from '../../../hooks/useH5Runtime'
import { navigateVisualUrl, normalizeVisualUrl } from '../../../utils/url'

interface Props {
  backgroundColor?: string
  showAuthor?: boolean
  showTime?: boolean
  data: VisualImageTextCardItem
}

const _props = defineProps<Props>()
const { colorVar } = useTheme()
const runtime = useH5Runtime()
const runtimeContext = useH5RuntimeContext()
const href = computed(() => normalizeVisualUrl(_props.data.link)?.url)
const cardStyle = computed<CSSProperties>(() => ({
  '--visual-image-text-two-surface-1': colorVar(_props.backgroundColor || 'surface-color'),
}))
const handleClick = (event: MouseEvent) => {
  event.preventDefault()
  const target = normalizeVisualUrl(_props.data.link)
  if (target?.url) navigateVisualUrl(target, runtime)
  else
    runtime.$emit(
      'article:click',
      { item: _props.data },
      { ...runtimeContext, interaction: 'click', item: _props.data, event },
    )
}
</script>

<style scoped lang="scss">
@use '../../../assets/scss/utils/index.scss' as *;

.visual-image-text-two {
  --visual-image-text-two-surface-1: var(--v-surface-color);
  --visual-image-text-two-text-color: var(--v-text-color);
  --visual-image-text-two-text-md: var(--v-text-md);
  --visual-image-text-two-spacing-sm: var(--v-spacing-sm);
  --visual-image-text-two-black-opacity-6: var(--v-black-opacity-6);
  --visual-image-text-two-spacing-md: var(--v-spacing-md);
  --components-surface-1: var(--visual-image-text-two-surface-1);
  --components-text-md: var(--visual-image-text-two-text-md);
  --components-cover-height: var(--visual-image-text-two-cover-height);
  --components-spacing-sm: var(--visual-image-text-two-spacing-sm);
  --components-black-opacity-6: var(--visual-image-text-two-black-opacity-6);
  --components-white: var(--v-white);
  --components-spacing-md: var(--visual-image-text-two-spacing-md);
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--components-surface-1);
  color: var(--visual-image-text-two-text-color);
  font-size: var(--components-text-md);

  .visual-image-text__content {
    position: relative;

    .visual-image-text__cover {
      width: 100%;
      height: var(--components-cover-height, 150px);

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
      padding: var(--components-spacing-sm);
      background-color: var(--components-black-opacity-6);
      color: var(--components-white);
      font-size: var(--components-text-md);
      @include ellipsis(2);
    }
  }

  .visual-image-text__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--components-spacing-md);
    gap: var(--components-spacing-sm);
  }
}
</style>
