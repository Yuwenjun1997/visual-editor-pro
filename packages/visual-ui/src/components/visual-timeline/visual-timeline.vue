<template>
  <visual-box :class="_props.class" class="visual-timeline" :styles="_props.styles" :show-empty="_noListData">
    <div class="visual-timeline__list">
      <div
        v-for="(item, index) in _props.listData"
        :key="index"
        class="visual-timeline__item"
        :class="'visual-timeline__item--' + (item.status || 'todo')"
      >
        <div class="visual-timeline__node">
          <span class="visual-timeline__dot" />
        </div>
        <div class="visual-timeline__content">
          <div class="visual-timeline__head">
            <visual-icon v-if="item.icon" size="16px" :icon="item.icon" class="visual-timeline__head-icon" />
            <div class="visual-timeline__title">{{ item.title }}</div>
          </div>
          <div v-if="item.desc" class="visual-timeline__desc">
            {{ item.desc }}
          </div>
          <div v-if="_props.props.showTime !== false && item.time" class="visual-timeline__time">
            {{ item.time }}
          </div>
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualIcon from '../visual-icon/visual-icon.vue'
import type { VisualTimelineItem, VisualTimelineProps } from './interface'

interface Props {
  props: VisualTimelineProps
  styles?: CSSProperties
  listData?: VisualTimelineItem[]
  class?: string
}

defineOptions({
  name: 'VisualTimeline',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _noListData = computed(() => _props.listData.length <= 0)
</script>

<style scoped lang="scss">
.visual-timeline {
  .visual-timeline__list {
    padding: 8px 0;
  }

  .visual-timeline__item {
    position: relative;
    display: flex;
    gap: 12px;
    padding-bottom: 20px;

    // 连接线由节点列向下穿满 padding-bottom，与下一项节点相连
    &:not(:last-child) {
      .visual-timeline__node::after {
        content: '';
        position: absolute;
        top: 18px;
        bottom: -20px;
        left: 50%;
        width: 2px;
        transform: translateX(-1px);
        background: var(--v-border-1, #e5e8f2);
      }
    }

    &--done .visual-timeline__dot {
      background: var(--v-success-1, #3ecf8e);
    }

    &--doing .visual-timeline__dot {
      background: var(--v-primary-1, #4f6ef7);
      box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.18);
    }

    &--todo .visual-timeline__dot {
      background: var(--v-text-3, #b3bac7);
    }
  }

  .visual-timeline__node {
    position: relative;
    flex-shrink: 0;
    width: 18px;
  }

  .visual-timeline__dot {
    display: block;
    width: 12px;
    height: 12px;
    margin: 4px 0 0 3px;
    border-radius: 50%;
  }

  .visual-timeline__content {
    flex: 1;
    min-width: 0;
  }

  .visual-timeline__head {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .visual-timeline__head-icon {
    flex-shrink: 0;
    color: var(--v-primary-1, #2563eb);
  }

  .visual-timeline__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--v-text-1, #2b2f3a);
  }

  .visual-timeline__desc {
    margin-top: 3px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--v-text-2, #6b7280);
  }

  .visual-timeline__time {
    margin-top: 4px;
    font-size: 12px;
    color: var(--v-text-3, #b3bac7);
  }
}
</style>
