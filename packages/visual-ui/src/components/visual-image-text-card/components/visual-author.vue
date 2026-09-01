<template>
  <div class="visual-news-author">
    <img
      :src="props.authorAvatar"
      style="object-fit: cover"
    />
    <span class="author-name">{{ props.authorName }}</span>
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
  display: flex;
  align-items: center;
  gap: var(--v-spacing-xs);

  img {
    display: block;
    width: var(--v-text-md);
    height: var(--v-text-md);
    border-radius: var(--v-text-md);
  }

  .author-name {
    font-size: var(--v-text-sm);
    color: var(--v-text-3);
  }
}
</style>
