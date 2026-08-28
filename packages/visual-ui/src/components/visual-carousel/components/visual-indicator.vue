<template>
  <div class="visual-indicator" :class="bindClassList">
    <span v-if="type === 'title'">{{ showTitle }}</span>
    <span v-else-if="type === 'fixed-right'">
      {{ current + 1 }}/{{ props.list.length }}
    </span>
    <template v-else>
      <div
        class="visual-indicator-item"
        :class="{ 'is-active': index === current }"
        v-for="(item, index) in props.list"
        :key="index"
        :data-index="index + 1"
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

const showTitle = computed(() => props.list[current.value || 0].title)

const bindClassList = computed(() => ['visual-indicator__' + props.type])
</script>

<style scoped lang="scss">
.visual-indicator {
  position: absolute;
  z-index: 99;
  display: flex;

  &.visual-indicator__dot,
  &.visual-indicator__line,
  &.visual-indicator__number {
    bottom: 6px;
    gap: 6px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.visual-indicator__dot {
    .visual-indicator-item {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--v-gray-2);
      box-shadow: 0 2px 6px rgba(16, 16, 16, 0.18);
      transition: all 0.4s;
      &.is-active {
        background-color: var(--v-primary-1);
        animation: vu-breathe 2.4s var(--v-ease-soft) infinite alternate;
      }
    }
  }

  &.visual-indicator__line {
    .visual-indicator-item {
      width: 14px;
      height: 4px;
      border-radius: 2px;
      background-color: var(--v-gray-2);
      box-shadow: 0 2px 6px rgba(16, 16, 16, 0.18);
      transition: all 0.4s;
      &.is-active {
        width: 26px;
        background-color: var(--v-primary-1);
      }
    }
  }

  &.visual-indicator__number {
    .visual-indicator-item {
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
        font-family: var(--v-font-display);
        font-size: 12px;
        color: var(--v-white);
      }

      &.is-active {
        background-color: var(--v-primary-1);
        animation: vu-breathe 2.4s var(--v-ease-soft) infinite alternate;
      }
    }
  }

  &.visual-indicator__title {
    bottom: 0;
    width: 100%;
    line-height: 32px;
    background-color: var(--v-black-opacity-2);
    color: var(--v-white);
    font-family: var(--v-font-body);
    font-size: var(--v-text-sm);
    padding: 0 var(--v-spacing-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &.visual-indicator__fixed-right {
    right: 0;
    bottom: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    color: var(--v-white);
    font-family: var(--v-font-display);
    font-size: 13px;
    line-height: 24px;
    border-radius: 20px 0 0 20px;
    padding-left: 12px;
  }
}
</style>
