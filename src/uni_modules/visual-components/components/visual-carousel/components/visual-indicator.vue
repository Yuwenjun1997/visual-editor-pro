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
    bottom: 12px;
    gap: 12px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.visual-indicator__dot {
    .visual-indicator-item {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--v-primary-6);
      transition: all 0.4s;
      &.is-active {
        background-color: var(--v-primary-1);
      }
    }
  }

  &.visual-indicator__line {
    .visual-indicator-item {
      width: 12px;
      height: 4px;
      border-radius: 2px;
      background-color: var(--v-primary-6);
      transition: all 0.4s;
      &.is-active {
        width: 24px;
        background-color: var(--v-primary-1);
      }
    }
  }

  &.visual-indicator__number {
    gap: 12px;
    bottom: 8px;
    .visual-indicator-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s;

      &::after {
        content: attr(data-index);
        font-size: 20px;
        color: #fff;
      }

      &.is-active {
        background-color: var(--v-primary-1);
      }
    }
  }

  &.visual-indicator__title {
    bottom: 0;
    width: 100%;
    line-height: 48px;
    background-color: var(--v-black-opacity-1);
    color: #fff;
    font-size:  var(--v-text-sm);
    padding: 0 var(--v-spacing-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &.visual-indicator__fixed-right {
    right: 0;
    bottom: 12px;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: var(--v-text-sm);
    line-height: 40px;
    border-radius: 20px 0 0 20px;
    padding-left: 12px;
  }
}
</style>
