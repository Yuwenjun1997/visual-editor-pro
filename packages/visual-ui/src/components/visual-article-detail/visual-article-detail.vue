<template>
  <section class="v-detail">
    <slot name="top" />
    <p v-if="loading" role="status">正在加载…</p>
    <p v-else-if="error" role="alert">
      {{ error }}
      <button type="button" @click="load">重试</button>
    </p>
    <p v-else-if="!item">请设置文章 ID 或在详情页查看</p>
    <template v-else>
      <img
        v-if="props.showCover !== false && item.cover_url"
        :alt="item.title"
        :src="item.cover_url"
        class="v-detail-cover"
      />
      <h1 v-if="props.showTitle !== false">{{ item.title }}</h1>

      <p v-if="props.showAuthor !== false && item.author_name">{{ item.author_name }}</p>
      <p v-if="props.showTime !== false && item.publish_time">{{ item.publish_time }}</p>
      <p v-if="props.showSummary !== false && item.summary">{{ item.summary }}</p>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <article v-if="props.showContent !== false && html" class="v-rich-content" v-html="html" />
    </template>
    <slot name="bottom" />
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDetail } from '../../hooks/useDetail'
import { sanitizeRichText } from '../../utils/sanitize'
import type { VisualArticleDetailProps } from './interface'
const input = withDefaults(defineProps<{ props?: VisualArticleDetailProps; articleId?: string }>(), {
  props: () => ({}),
})
const { item, loading, error, load } = useDetail('article', () => input.articleId || input.props.articleId)
const html = computed(() => sanitizeRichText(item.value?.content?.html || ''))
</script>
