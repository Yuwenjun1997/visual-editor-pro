<template>
  <a :href="href" :style="cardStyle" :class="_bindClassList" class="visual-image-text-one" @click="handleClick">
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
import type { CSSProperties } from 'vue'
import { useTheme } from '../../../hooks/useTheme'
import type { VisualImageTextListItem } from '../interface'
import VisualAuthor from './visual-author.vue'
import VisualTime from './visual-time.vue'
import { useH5Runtime, useH5RuntimeContext } from '../../../hooks/useH5Runtime'
import { navigateVisualUrl, normalizeVisualUrl } from '../../../utils/url'

interface Props {
  backgroundColor?: string
  showAuthor?: boolean
  showTime?: boolean
  data: VisualImageTextListItem
  corverInRight?: boolean
}

const _props = defineProps<Props>()
const { colorVar } = useTheme()
const runtime = useH5Runtime()
const runtimeContext = useH5RuntimeContext()
const href = computed(() => normalizeVisualUrl(_props.data.link)?.url)
const cardStyle = computed<CSSProperties>(() => ({
  '--visual-image-text-one-surface-1': colorVar(_props.backgroundColor || 'surface-color'),
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

const _bindClassList = computed(() => ({
  'cover-in-right': _props.corverInRight,
}))
</script>

<style scoped lang="scss">
@use '../../../assets/scss/utils/index.scss' as *;

.visual-image-text-one {
  --visual-image-text-one-surface-1: var(--v-surface-color);
  --visual-image-text-one-text-color: var(--v-text-color);
  --visual-image-text-one-text-md: var(--v-text-md);
  --visual-image-text-one-spacing-md: var(--v-spacing-md);
  --visual-image-text-one-spacing-sm: var(--v-spacing-sm);
  --components-surface-1: var(--visual-image-text-one-surface-1);
  --components-item-round: var(--visual-image-text-one-item-round);
  --components-text-md: var(--visual-image-text-one-text-md);
  --components-spacing-md: var(--visual-image-text-one-spacing-md);
  --components-spacing-sm: var(--visual-image-text-one-spacing-sm);
  display: flex;
  align-items: center;
  height: 92px;
  background-color: var(--components-surface-1);
  color: var(--visual-image-text-one-text-color);
  border-radius: var(--components-item-round);
  font-size: var(--components-text-md);

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
    padding: var(--components-spacing-md);
    gap: var(--components-spacing-sm);
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
