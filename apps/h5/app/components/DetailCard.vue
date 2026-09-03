<template>
  <main class="vh-mx-auto vh-max-w-2xl vh-p-4">
    <img v-if="item.cover_url" :src="item.cover_url" :alt="item.title" class="vh-mb-4 vh-w-full vh-rounded-xl" />
    <h1 class="vh-m-0 vh-text-2xl vh-font-bold">{{ item.title }}</h1>
    <template v-if="kind === 'product'">
      <p class="vh-text-xl vh-font-semibold vh-text-red-600">¥{{ item.price }}</p>
      <p v-if="item.description" class="vh-whitespace-pre-wrap">{{ item.description }}</p>
      <a
        v-if="item.buy_link"
        :href="item.buy_link"
        class="vh-inline-block vh-rounded vh-bg-blue-600 vh-px-4 vh-py-2 vh-text-white"
      >
        立即购买
      </a>
    </template>
    <template v-else>
      <p v-if="item.summary" class="vh-text-gray-500">{{ item.summary }}</p>
      <article class="article-content" v-html="safeHtml" />
    </template>
  </main>
</template>

<script setup lang="ts">
import { sanitizeRichText } from '@visual/ui/utils'

const props = defineProps<{ kind: 'product' | 'article'; item: Record<string, any> }>()
const safeHtml = computed(() => sanitizeRichText(props.item.content?.html || ''))
</script>

<style scoped>
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
