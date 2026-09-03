<template>
  <div
    :style="itemStyle"
    class="visual-product-item"
    :class="{ 'visual-product-item--horizontal': layout === 'horizontal' }"
  >
    <a :href="href" target="_blank" rel="noopener noreferrer" class="visual-product-item__media" @click="handleClick">
      <img v-if="cover" :alt="title" :src="cover" class="visual-product-item__cover" />
      <span v-else class="visual-product-item__cover visual-product-item__cover--empty">
        <i class="bi bi-image" />
      </span>
      <span v-if="showTag !== false && tag" class="visual-product-item__tag">
        {{ tag }}
      </span>
    </a>
    <div class="visual-product-item__info">
      <a :href="href" target="_blank" rel="noopener noreferrer" class="visual-product-item__title" @click="handleClick">
        {{ title || '商品标题' }}
      </a>
      <div class="visual-product-item__actions">
        <div class="visual-product-item__prices">
          <span class="visual-product-item__price">{{ priceText }}</span>
          <span v-if="originPriceText" class="visual-product-item__origin">
            {{ originPriceText }}
          </span>
        </div>
        <span v-if="showBuy !== false" class="visual-product-item__buy">
          {{ buttonText || '购买' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { formatPrice } from '../../utils/format'
import type { VisualProductItemProps } from './interface'

defineOptions({
  name: 'VisualProductItem',
})

const _props = withDefaults(defineProps<VisualProductItemProps>(), {
  data: () => ({}),
  layout: 'vertical',
  showTag: true,
  showBuy: true,
  buttonText: '购买',
  round: '',
  currency: '¥',
})

const cover = computed(() => _props.data?.cover || '')
const title = computed(() => _props.data?.title || '')
const tag = computed(() => _props.data?.tag || '')

const priceText = computed(() => formatPrice(_props.data?.price, { currency: _props.currency }))

const originPriceText = computed(() => {
  const origin = _props.data?.originPrice
  return origin != null && origin !== '' ? formatPrice(origin, { currency: _props.currency }) : ''
})

const href = computed(() => {
  const link = _props.data?.buyLink
  if (!link) return undefined
  return link.startsWith('http') ? link : `//${link}`
})

const handleClick = (event: MouseEvent) => {
  if (!href.value) event.preventDefault()
}

const itemStyle = computed<CSSProperties>(() => ({
  '--v-product-radius': _props.round || undefined,
}))
</script>

<style scoped lang="scss">
.visual-product-item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--v-product-radius);
  background: #fff;

  &--horizontal {
    flex-direction: row;

    .visual-product-item__media {
      width: 108px;
      flex-shrink: 0;
      aspect-ratio: auto;
    }

    .visual-product-item__info {
      padding: 10px 12px;
    }
  }

  .visual-product-item__media {
    position: relative;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    background: #f2f4fa;

    .visual-product-item__cover {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .visual-product-item__cover--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #c2c9d9;
    }
  }

  .visual-product-item__tag {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 5px 9px;
    border-radius: 0 0 8px 0;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    background: var(--v-error-1, #ff5c7a);
    color: #fff;
  }

  .visual-product-item__info {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    padding: 10px;
  }

  .visual-product-item__title {
    display: -webkit-box;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.4;
    color: var(--v-text-1, #2b2f3a);
    text-decoration: none;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .visual-product-item__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
  }

  .visual-product-item__prices {
    display: flex;
    align-items: baseline;
    gap: 6px;
    min-width: 0;
  }

  .visual-product-item__price {
    font-size: 18px;
    font-weight: 700;
    color: var(--v-error-1, #ff5c7a);
    font-variant-numeric: tabular-nums;
  }

  .visual-product-item__origin {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--v-text-3, #b3bac7);
    text-decoration: line-through;
  }

  .visual-product-item__buy {
    flex-shrink: 0;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    background: var(--v-gradient-primary);
    color: #fff;
  }
}
</style>
