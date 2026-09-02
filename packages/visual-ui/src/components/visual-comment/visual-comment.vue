<template>
  <visual-box :class="_props.class" class="visual-comment" :styles="_props.styles" :show-empty="_noListData">
    <div class="visual-comment__list">
      <div v-for="(item, index) in _props.listData" :key="index" class="visual-comment__item">
        <img v-if="item.avatar" :src="item.avatar" :alt="item.nickname" class="visual-comment__avatar" />
        <span v-else class="visual-comment__avatar visual-comment__avatar--empty">
          <i class="bi bi-person" />
        </span>
        <div class="visual-comment__main">
          <div class="visual-comment__head">
            <span class="visual-comment__nickname">{{ item.nickname || '匿名用户' }}</span>
            <span v-if="showRating !== false && item.rating" class="visual-comment__rating">
              <i v-for="n in 5" :key="n" :class="n <= item.rating ? 'bi bi-star-fill' : 'bi bi-star'" />
            </span>
            <span v-if="showTime !== false && item.time" class="visual-comment__time">
              {{ item.time }}
            </span>
          </div>
          <div class="visual-comment__content">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualCommentItem, VisualCommentProps } from './interface'

interface Props {
  props: VisualCommentProps
  styles?: CSSProperties
  listData?: VisualCommentItem[]
  class?: string
}

defineOptions({
  name: 'VisualComment',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)

const showTime = computed(() => _props.props.showTime)
const showRating = computed(() => _props.props.showRating)
</script>

<style scoped lang="scss">
.visual-comment {
  .visual-comment__list {
    padding: 4px 0;
  }

  .visual-comment__item {
    display: flex;
    gap: 12px;
    padding: 14px 0;

    & + & {
      border-top: 1px solid var(--v-border-1, #f0f2f8);
    }
  }

  .visual-comment__avatar {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    overflow: hidden;
    border-radius: 50%;
    object-fit: cover;
    background: #eef1ff;

    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #b3bde0;
    }
  }

  .visual-comment__main {
    flex: 1;
    min-width: 0;
  }

  .visual-comment__head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .visual-comment__nickname {
    font-size: 14px;
    font-weight: 600;
    color: var(--v-text-1, #2b2f3a);
  }

  .visual-comment__rating {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    font-size: 12px;
    color: var(--v-warning-1, #f6b73c);
  }

  .visual-comment__time {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 12px;
    color: var(--v-text-3, #b3bac7);
  }

  .visual-comment__content {
    margin-top: 5px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--v-text-2, #464c59);
  }
}
</style>
