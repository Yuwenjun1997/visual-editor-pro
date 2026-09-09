<template>
  <div :class="bindClassList" class="visual-indicator">
    <span v-if="type === 'title'">{{ showTitle }}</span>
    <span v-else-if="type === 'fixed-right'">{{ current + 1 }}/{{ props.list.length }}</span>
    <template v-else>
      <div
        v-for="(item, index) in props.list"
        :key="index"
        :data-index="index + 1"
        class="visual-indicator__item"
        :class="{ 'visual-indicator__item--active': index === current }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { VisualCarouselItem } from '../interface'

interface Props {
  list: VisualCarouselItem[]
  current?: number
  type?: 'dot' | 'number' | 'title' | 'fixed-right' | 'line'
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  type: 'dot',
})

const emit = defineEmits<{
  (e: 'update:current', value?: number): void
}>()

const current = computed({
  get: () => props.current,
  set: (value) => emit('update:current', value),
})

const showTitle = computed(() => props.list[current.value || 0]?.title)

const bindClassList = computed(() => ['visual-indicator--' + props.type])
</script>

<style scoped lang="scss">
.visual-indicator {
  --visual-indicator-gray-2: var(--v-gray-2);
  --visual-indicator-primary-1: var(--v-primary-1);
  --visual-indicator-ease-soft: var(--v-ease-soft);
  --visual-indicator-font-display: var(--v-font-display);
  --visual-indicator-white: var(--v-white);
  --visual-indicator-black-opacity-2: var(--v-black-opacity-2);
  --visual-indicator-font-body: var(--v-font-body);
  --visual-indicator-text-sm: var(--v-text-sm);
  --visual-indicator-spacing-xs: var(--v-spacing-xs);
  --components-gray-2: var(--visual-indicator-gray-2);
  --components-primary-1: var(--visual-indicator-primary-1);
  --components-ease-soft: var(--visual-indicator-ease-soft);
  --components-font-display: var(--visual-indicator-font-display);
  --components-white: var(--visual-indicator-white);
  --components-black-opacity-2: var(--visual-indicator-black-opacity-2);
  --components-font-body: var(--visual-indicator-font-body);
  --components-text-sm: var(--visual-indicator-text-sm);
  --components-spacing-xs: var(--visual-indicator-spacing-xs);
  position: absolute;
  z-index: 99;
  display: flex;

  &.visual-indicator--dot,
  &.visual-indicator--line,
  &.visual-indicator--number {
    bottom: 6px;
    gap: 6px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.visual-indicator--dot {
    .visual-indicator__item {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--components-gray-2);
      box-shadow: 0 2px 6px rgba(16, 16, 16, 0.18);
      transition: all 0.4s;
      &--active {
        background-color: var(--components-primary-1);
        animation: vu-breathe 2.4s var(--components-ease-soft) infinite alternate;
      }
    }
  }

  &.visual-indicator--line {
    .visual-indicator__item {
      width: 14px;
      height: 4px;
      border-radius: 2px;
      background-color: var(--components-gray-2);
      box-shadow: 0 2px 6px rgba(16, 16, 16, 0.18);
      transition: all 0.4s;
      &--active {
        width: 26px;
        background-color: var(--components-primary-1);
      }
    }
  }

  &.visual-indicator--number {
    .visual-indicator__item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 6px rgba(16, 16, 16, 0.18);
      transition: all 0.4s;

      &::after {
        content: attr(data-index);
        font-family: var(--components-font-display);
        font-size: 12px;
        color: var(--components-white);
      }

      &--active {
        background-color: var(--components-primary-1);
        animation: vu-breathe 2.4s var(--components-ease-soft) infinite alternate;
      }
    }
  }

  &.visual-indicator--title {
    bottom: 0;
    width: 100%;
    line-height: 32px;
    background-color: var(--components-black-opacity-2);
    color: var(--components-white);
    font-family: var(--components-font-body);
    font-size: var(--components-text-sm);
    padding: 0 var(--components-spacing-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &.visual-indicator--fixed-right {
    right: 0;
    bottom: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    color: var(--components-white);
    font-family: var(--components-font-display);
    font-size: 13px;
    line-height: 24px;
    border-radius: 20px 0 0 20px;
    padding-left: 12px;
  }
}
</style>
