<template>
  <div aria-label="应用导航" :style="tabbarStyle" class="visual-tabbar">
    <nav class="visual-tabbar__inner">
      <button
        v-for="item in visibleItems"
        :key="item.key"
        type="button"
        class="visual-tabbar__item"
        :class="{ 'visual-tabbar__item--active': item.active }"
        @click="$emit('navigate', item)"
      >
        <i v-if="item.icon" aria-hidden="true" :class="item.icon" />
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VisualTabbarItem, VisualTabbarProps } from './interface'
import { useTheme } from '../../hooks/useTheme'

defineOptions({ name: 'VisualTabbar' })
const props = withDefaults(defineProps<VisualTabbarProps>(), {
  items: () => [],
  activeColor: '#2563eb',
  inactiveColor: '#6b7280',
  backgroundColor: '#ffffff',
  height: 52,
  safeArea: true,
})
const { colorVar } = useTheme()
const tabbarStyle = computed(() => ({
  '--visual-tabbar-active': colorVar(props.activeColor),
  '--visual-tabbar-inactive': colorVar(props.inactiveColor),
  '--visual-tabbar-background': colorVar(props.backgroundColor),
  '--visual-tabbar-height': `${props.height}px`,
}))
defineEmits<{ navigate: [item: VisualTabbarItem] }>()
const visibleItems = computed(() =>
  Array.from(props.items)
    .filter((item) => item !== undefined && item.visible !== false)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0)),
)
</script>

<style scoped lang="scss">
.visual-tabbar {
  --visual-tabbar-safe-area-bottom: var(--v-safe-area-bottom);
  flex-shrink: 0;
  min-height: var(--visual-tabbar-height);
}
.visual-tabbar__inner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  min-height: var(--visual-tabbar-height);
  padding-bottom: var(--visual-tabbar-safe-area-bottom, 0px);
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
  font-size: 14px;
}
.visual-tabbar__item--active {
  color: var(--visual-tabbar-active);
}
.visual-tabbar__item i {
  display: block;
  margin-bottom: 2px;
  font-size: 18px;
}
</style>
