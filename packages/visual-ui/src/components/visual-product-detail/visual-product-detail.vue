<template>
  <section class="v-detail">
    <slot name="top" />
    <p v-if="loading" role="status">正在加载…</p>
    <p v-else-if="error" role="alert">
      {{ error }}
      <button type="button" @click="load">重试</button>
    </p>
    <p v-else-if="!item">请设置商品 ID 或在详情页查看</p>
    <template v-else>
      <img
        v-if="props.showCover !== false && item.cover_url"
        :alt="item.title"
        :src="item.cover_url"
        class="v-detail-cover"
      />
      <h1 v-if="props.showTitle !== false">{{ item.title }}</h1>

      <p v-if="props.showPrice !== false && item.price != null" class="v-detail-price">
        ¥{{ item.price }}
        <del v-if="props.showOriginPrice !== false && item.origin_price != null">{{ item.origin_price }}</del>
      </p>
      <p v-if="props.showTag !== false && item.tag">{{ item.tag }}</p>
      <p v-if="props.showDescription !== false && item.description" class="v-detail-description">
        {{ item.description }}
      </p>
      <a
        v-if="props.showBuyLink !== false && safeBuyLink"
        :href="safeBuyLink"
        class="v-detail-action"
        rel="noopener noreferrer"
      >
        立即购买
      </a>

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
import type { VisualProductDetailProps } from './interface'
const input = withDefaults(defineProps<{ props?: VisualProductDetailProps; productId?: string }>(), {
  props: () => ({}),
})
const { item, loading, error, load } = useDetail('product', () => input.productId || input.props.productId)
const html = computed(() => sanitizeRichText(item.value?.content?.html || ''))
const safeBuyLink = computed(() => (/^https?:\/\//i.test(item.value?.buy_link || '') ? item.value!.buy_link : ''))
</script>
