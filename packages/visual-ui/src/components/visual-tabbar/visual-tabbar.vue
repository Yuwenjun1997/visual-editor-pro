<template>
  <nav
    aria-label="应用导航"
    class="visual-tabbar"
    :style="{
      '--visual-tabbar-active': activeColor,
      '--visual-tabbar-inactive': inactiveColor,
      '--visual-tabbar-background': backgroundColor,
      '--visual-tabbar-height': `${height}px`,
    }"
  >
    <button
      v-for="item in visibleItems"
      :key="item.key"
      type="button"
      class="visual-tabbar__item"
      :class="{ 'is-active': item.active }"
      @click="$emit('navigate', item)"
    >
      <i v-if="item.icon" aria-hidden="true" :class="item.icon" />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VisualTabbarItem, VisualTabbarProps } from './interface'

defineOptions({ name: 'VisualTabbar' })
const props = withDefaults(defineProps<VisualTabbarProps>(), {
  items: () => [],
  activeColor: '#2563eb',
  inactiveColor: '#6b7280',
  backgroundColor: '#ffffff',
  height: 52,
  safeArea: true,
})
defineEmits<{ navigate: [item: VisualTabbarItem] }>()
const visibleItems = computed(() =>
  [...props.items]
    .filter((item) => item !== undefined && item.visible !== false)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0)),
)
</script>

<style scoped lang="scss">
.visual-tabbar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  min-height: var(--visual-tabbar-height);
  padding-bottom: var(--v-safe-area-bottom, 0px);
  background: var(--visual-tabbar-background);
  border-top: 1px solid color-mix(in srgb, var(--visual-tabbar-inactive) 18%, transparent);
}
.visual-tabbar__item {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--visual-tabbar-inactive);
  font: inherit;
  cursor: pointer;
}
.visual-tabbar__item.is-active {
  color: var(--visual-tabbar-active);
}
.visual-tabbar__item i {
  display: block;
  margin-bottom: 2px;
  font-size: 18px;
}
</style>
