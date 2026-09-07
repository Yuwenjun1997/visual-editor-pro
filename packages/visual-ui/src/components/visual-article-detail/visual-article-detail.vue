<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="v-article-detail">
    <div class="v-article-detail__card">
      <p v-if="loading" role="status" class="v-article-detail__state">正在加载…</p>
      <p v-else-if="error" role="alert" class="v-article-detail__state">
        {{ error }}
        <button type="button" @click="load">重试</button>
      </p>
      <p v-else-if="!item" class="v-article-detail__state">请设置文章 ID 或在详情页查看</p>
      <template v-else>
        <img
          v-if="props.showCover !== false && item.cover_url"
          :alt="item.title"
          :src="item.cover_url"
          class="v-article-detail__cover"
        />
        <div class="v-article-detail__body">
          <h1 v-if="props.showTitle !== false" class="v-article-detail__title">{{ item.title }}</h1>
          <p v-if="props.showSummary !== false && item.summary" class="v-article-detail__summary">{{ item.summary }}</p>

          <div v-if="showMeta" class="v-article-detail__meta">
            <span v-if="categoryLabel" class="v-article-detail__category">{{ categoryLabel }}</span>
            <span v-if="props.showAuthor !== false && item.author_name" class="v-article-detail__author">
              <span aria-hidden="true" class="v-article-detail__avatar">{{ authorInitial }}</span>
              <span>{{ item.author_name }}</span>
            </span>
            <span v-if="props.showTime !== false && item.publish_time" class="v-article-detail__time">
              <i aria-hidden="true" class="bi bi-calendar3" />
              {{ formattedPublishTime }}
            </span>
          </div>
          <article
            v-if="props.showContent !== false && html"
            class="v-article-detail__content v-rich-content"
            v-html="html"
          />
        </div>
      </template>
    </div>
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
const formattedPublishTime = computed(() => {
  const raw = item.value?.publish_time
  if (!raw) return ''

  const normalized = raw.includes(' ') ? raw.replace(' ', 'T') : raw
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return raw

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(/\//g, '-')
})
const categoryLabel = computed(() => {
  const value = item.value?.category_name || item.value?.categoryName || item.value?.category
  if (typeof value === 'string') return value.trim()
  if (value && typeof value.name === 'string') return value.name.trim()
  return ''
})
const authorInitial = computed(
  () =>
    String(item.value?.author_name || '作')
      .trim()
      .slice(0, 1) || '作',
)
const showMeta = computed(
  () =>
    Boolean(categoryLabel.value) ||
    (input.props.showAuthor !== false && Boolean(item.value?.author_name)) ||
    (input.props.showTime !== false && Boolean(item.value?.publish_time)),
)
</script>
