<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="visual-article-detail">
    <div class="visual-article-detail__card">
      <p v-if="loading" role="status" class="visual-article-detail__state">正在加载…</p>
      <p v-else-if="error" role="alert" class="visual-article-detail__state">
        {{ error }}
        <button type="button" @click="load">重试</button>
      </p>
      <visual-detail-empty-state v-else-if="!item" label="文章" />
      <template v-else>
        <img
          v-if="props.showCover !== false && item.cover_url"
          :alt="item.title"
          :src="item.cover_url"
          class="visual-article-detail__cover"
        />
        <div class="visual-article-detail__body">
          <h1 v-if="props.showTitle !== false" class="visual-article-detail__title">{{ item.title }}</h1>
          <p v-if="props.showSummary !== false && item.summary" class="visual-article-detail__summary">
            {{ item.summary }}
          </p>

          <div v-if="showMeta" class="visual-article-detail__meta">
            <span v-if="categoryLabel" class="visual-article-detail__category">{{ categoryLabel }}</span>
            <span v-if="props.showAuthor !== false && item.author_name" class="visual-article-detail__author">
              <span aria-hidden="true" class="visual-article-detail__avatar">{{ authorInitial }}</span>
              <span>{{ item.author_name }}</span>
            </span>
            <span v-if="props.showTime !== false && item.publish_time" class="visual-article-detail__time">
              <i aria-hidden="true" class="bi bi-calendar3" />
              {{ formattedPublishTime }}
            </span>
          </div>
          <article v-if="props.showContent !== false && html" class="visual-article-detail__content" v-html="html" />
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
import VisualDetailEmptyState from '../visual-detail-empty-state/visual-detail-empty-state.vue'
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

<style lang="scss">
.visual-article-detail {
  --visual-article-detail-text-1: var(--v-text-1);
  --visual-article-detail-text-2: var(--v-text-2);
  --visual-article-detail-text-3: var(--v-text-3);
  --visual-article-detail-gray-2: var(--v-gray-2);
  --visual-article-detail-primary-1: var(--v-primary-color);
  --visual-article-detail-surface-1: var(--v-white);
  --visual-article-detail-white: var(--v-white);
  --visual-article-detail-font-body: var(--v-font-body);
  --visual-article-detail-gray-1: var(--v-gray-1);
  --visual-article-detail-font-display: var(--v-font-display);
  --visual-article-detail-gradient-primary: var(--v-gradient-primary);
  --visual-article-detail-primary-opacity-6: var(--v-primary-opacity-6);
  --visual-article-detail-article-ink: var(--visual-article-detail-text-1, #172033);
  --visual-article-detail-article-muted: var(--visual-article-detail-text-2, #5e6b7e);
  --visual-article-detail-article-subtle: var(--visual-article-detail-text-3, #8a96a8);
  --visual-article-detail-article-line: var(--visual-article-detail-gray-2, #e7ebf0);
  --visual-article-detail-article-accent: var(--visual-article-detail-primary-1, #3b82f6);
  min-width: 0;
  container: article-detail / inline-size;
  background: var(--visual-article-detail-surface-1, var(--visual-article-detail-white, #fff));
  color: var(--visual-article-detail-article-ink);
  font-family: var(--visual-article-detail-font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);

  &__card {
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
  }
  &__cover {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 520px;
    object-fit: cover;
    background: var(--visual-article-detail-gray-1, #eef2f7);
  }
  &__body {
    padding: 24px 20px 36px;
  }
  &__title {
    max-width: 760px;
    margin: 0;
    font-family: var(--visual-article-detail-font-display, var(--visual-article-detail-font-body));
    font-size: clamp(24px, 7cqw, 40px);
    font-weight: 760;
    letter-spacing: -0.025em;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  &__summary {
    max-width: 720px;
    margin: 16px 0 0;
    color: var(--visual-article-detail-article-muted);
    font-size: 16px;
    line-height: 1.7;
  }
  &__meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 12px;
    margin-top: 22px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--visual-article-detail-article-line);
    color: var(--visual-article-detail-article-subtle);
    font-size: 13px;
  }
  &__category {
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    border: 1px solid rgb(59 130 246 / 10%);
    border-radius: 999px;
    background: #eff6ff;
    color: var(--visual-article-detail-article-accent);
    font-size: 13px;
    font-weight: 650;
    line-height: 1;
    padding: 6px 11px;
  }
  &__author,
  &__time {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  &__author {
    color: var(--visual-article-detail-article-ink);
    font-weight: 650;
  }
  &__avatar {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border-radius: 50%;
    background: var(--visual-article-detail-gradient-primary, linear-gradient(135deg, #3b82f6, #7655ed));
    box-shadow: 0 5px 12px rgb(59 130 246 / 18%);
    color: var(--visual-article-detail-white, #fff);
    font-size: 14px;
    font-weight: 700;
  }
  &__time {
    padding-left: 14px;
    border-left: 1px solid var(--visual-article-detail-article-line);
  }
  &__time .bi {
    color: var(--visual-article-detail-text-3, #8b9ab0);
    font-size: 15px;
  }
  &__content {
    max-width: 720px;
    margin-top: 28px;
    color: var(--visual-article-detail-article-muted);
    font-size: 16px;
    letter-spacing: 0.005em;
    line-height: 1.85;
    overflow-wrap: anywhere;
  }
  &__content > :first-child {
    margin-top: 0;
  }
  &__content h2,
  &__content h3,
  &__content h4 {
    margin: 1.8em 0 0.65em;
    color: var(--visual-article-detail-article-ink);
    font-family: var(--visual-article-detail-font-display, var(--visual-article-detail-font-body));
    font-weight: 720;
    letter-spacing: -0.015em;
    line-height: 1.35;
  }
  &__content h2 {
    font-size: 21px;
  }
  &__content h3 {
    font-size: 18px;
  }
  &__content h4 {
    font-size: 16px;
  }
  &__content p {
    margin: 0 0 1.25em;
  }
  &__content a {
    color: var(--visual-article-detail-article-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  &__content strong {
    color: var(--visual-article-detail-article-ink);
    font-weight: 700;
  }
  &__content img,
  &__content video {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    margin: 1.5em 0;
    border-radius: 12px;
  }
  &__content ul,
  &__content ol {
    margin: 0 0 1.25em;
    padding-left: 1.5em;
  }
  &__content li + li {
    margin-top: 0.45em;
  }
  &__content blockquote {
    margin: 1.5em 0;
    border-left: 3px solid var(--visual-article-detail-article-accent);
    border-radius: 0 10px 10px 0;
    background: var(--visual-article-detail-primary-opacity-6, #f5f8ff);
    padding: 14px 16px;
  }
  &__content pre {
    margin: 1.5em 0;
    overflow-x: auto;
    border-radius: 10px;
    background: #172033;
    color: #e8eef8;
    font-size: 14px;
    line-height: 1.65;
    padding: 16px;
  }
  &__content code {
    border-radius: 4px;
    background: var(--visual-article-detail-gray-1, #f1f4f8);
    color: var(--visual-article-detail-article-ink);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.88em;
    padding: 0.15em 0.35em;
  }
  &__content pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }
  &__content hr {
    margin: 2em 0;
    border: 0;
    border-top: 1px solid var(--visual-article-detail-article-line);
  }
  &__state {
    margin: 0;
    padding: 48px 24px;
    color: var(--visual-article-detail-article-subtle);
    text-align: center;
  }
  &__state button {
    margin-left: 6px;
    border: 1px solid var(--visual-article-detail-article-line);
    border-radius: 999px;
    background: var(--visual-article-detail-surface-1, #fff);
    color: var(--visual-article-detail-article-accent);
    cursor: pointer;
    font: inherit;
    padding: 6px 12px;
  }
  &__state button:focus-visible,
  &__content a:focus-visible {
    outline: 3px solid rgb(59 130 246 / 35%);
    outline-offset: 3px;
  }
}

@container article-detail (min-width: 768px) {
  .visual-article-detail {
    padding: 0 24px 56px;
  }
  .visual-article-detail__card {
    max-width: 1040px;
  }
  .visual-article-detail__body {
    padding: 42px clamp(32px, 7vw, 76px) 64px;
  }
  .visual-article-detail__content {
    font-size: 17px;
    line-height: 1.9;
  }
  .visual-article-detail__content h2 {
    font-size: 24px;
  }
  .visual-article-detail__content h3 {
    font-size: 20px;
  }
  .visual-article-detail__content h4 {
    font-size: 18px;
  }
  .visual-article-detail__cover {
    aspect-ratio: 2.15 / 1;
  }
  .visual-article-detail__meta {
    margin-top: 26px;
  }
}

@container article-detail (max-width: 380px) {
  .visual-article-detail__body {
    padding-right: 16px;
    padding-left: 16px;
  }
  .visual-article-detail__meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .visual-article-detail__time {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
