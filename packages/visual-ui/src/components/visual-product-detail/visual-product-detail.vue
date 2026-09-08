<template>
  <section class="visual-product-detail">
    <p v-if="loading" role="status" class="visual-product-detail__state">正在加载…</p>
    <p v-else-if="error" role="alert" class="visual-product-detail__state">
      {{ error }}
      <button type="button" @click="load">重试</button>
    </p>
    <visual-detail-empty-state v-else-if="!item" label="商品" />
    <template v-else>
      <img
        v-if="props.showCover !== false && item.cover_url"
        :alt="item.title"
        :src="item.cover_url"
        class="visual-product-detail__cover"
      />
      <h1 v-if="props.showTitle !== false" class="visual-product-detail__title">{{ item.title }}</h1>

      <p v-if="props.showPrice !== false && item.price != null" class="visual-product-detail__price">
        ¥{{ item.price }}
        <del v-if="props.showOriginPrice !== false && item.origin_price != null">{{ item.origin_price }}</del>
      </p>
      <p v-if="props.showTag !== false && item.tag" class="visual-product-detail__tag">{{ item.tag }}</p>
      <p v-if="props.showDescription !== false && item.description" class="visual-product-detail__description">
        {{ item.description }}
      </p>
      <a
        v-if="props.showBuyLink !== false && safeBuyLink"
        :href="safeBuyLink"
        rel="noopener noreferrer"
        class="visual-product-detail__action"
      >
        立即购买
      </a>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <article v-if="props.showContent !== false && html" class="visual-product-detail__content" v-html="html" />
    </template>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useDetail } from '../../hooks/useDetail'
import { sanitizeRichText } from '../../utils/sanitize'
import type { VisualProductDetailProps } from './interface'
import VisualDetailEmptyState from '../visual-detail-empty-state/visual-detail-empty-state.vue'
const input = withDefaults(defineProps<{ props?: VisualProductDetailProps; productId?: string }>(), {
  props: () => ({}),
})
const { item, loading, error, load } = useDetail('product', () => input.productId || input.props.productId)
const html = computed(() => sanitizeRichText(item.value?.content?.html || ''))
const safeBuyLink = computed(() => (/^https?:\/\//i.test(item.value?.buy_link || '') ? item.value!.buy_link : ''))
</script>

<style lang="scss">
.visual-product-detail {
  --visual-product-detail-bg-color: var(--v-background-color);
  --visual-product-detail-text-color: var(--v-text-color);
  --visual-product-detail-text-2: var(--v-text-2);
  --visual-product-detail-primary: var(--v-primary);
  background: var(--visual-product-detail-bg-color);
  color: var(--visual-product-detail-text-color);

  &__state {
    margin: 0;
    padding: 48px 24px;
    color: var(--visual-product-detail-text-2);
    text-align: center;
  }
  &__cover {
    width: 100%;
    border-radius: 20px;
    object-fit: cover;
  }
  &__title {
    margin: 20px 0 12px;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.35;
  }
  &__price {
    color: #dc2626;
    font-size: 24px;
    font-weight: 600;
  }
  &__price del {
    color: #64748b;
    font-size: 14px;
  }
  &__tag {
    margin: 1em 0;
  }
  &__description {
    white-space: pre-wrap;
  }
  &__action {
    display: inline-block;
    border: 0;
    border-radius: 12px;
    background: var(--visual-product-detail-primary, #4f46e5);
    color: #fff;
    cursor: pointer;
    padding: 10px 16px;
  }
  &__content {
    line-height: 1.8;
    overflow-wrap: anywhere;
  }
  &__content img {
    max-width: 100%;
    height: auto;
  }
  &__content ul {
    list-style: disc;
    padding-left: 24px;
  }
  &__content ol {
    list-style: decimal;
    padding-left: 24px;
  }
  &__content h2 {
    font-size: 24px;
    font-weight: 700;
  }
  &__content blockquote {
    border-left: 3px solid #cbd5e1;
    padding-left: 16px;
  }
}
</style>
