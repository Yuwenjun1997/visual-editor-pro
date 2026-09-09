<template>
  <div class="visual-news-author">
    <img :src="props.authorAvatar" style="object-fit: cover" />
    <span class="visual-news-author__name">{{ props.authorName }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  authorName?: string
  authorAvatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  authorName: '游客',
  authorAvatar: 'https://picsum.photos/120/120?random=' + Math.random() * 100,
})
</script>

<style scoped lang="scss">
.visual-news-author {
  --visual-author-spacing-xs: var(--v-spacing-xs);
  --visual-author-text-md: var(--v-text-md);
  --visual-author-text-sm: var(--v-text-sm);
  --visual-author-text-3: var(--v-text-3);
  --components-spacing-xs: var(--visual-author-spacing-xs);
  --components-text-md: var(--visual-author-text-md);
  --components-text-sm: var(--visual-author-text-sm);
  --components-text-3: var(--visual-author-text-3);
  display: flex;
  align-items: center;
  gap: var(--components-spacing-xs);

  img {
    display: block;
    width: var(--components-text-md);
    height: var(--components-text-md);
    border-radius: var(--components-text-md);
  }

  &__name {
    font-size: var(--components-text-sm);
    color: var(--components-text-3);
  }
}
</style>
