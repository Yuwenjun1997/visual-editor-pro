<template>
  <div class="visual-app" :class="_props.class">
    <slot />
    <Sonner />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useSafeArea } from '../../hooks/useSafeArea'
import { mountThemeToRoot } from '../../hooks/useMountThemeToRoot'
import Sonner from '../../deps/toast/sonner.vue'
import type { VisualAppProps } from './interface'

defineOptions({
  name: 'VApp',
})

const _props = withDefaults(defineProps<VisualAppProps>(), {
  safeAreaBottom: true,
})

const { bottom } = useSafeArea()

const _safeAreaBottom = computed(() => (_props.safeAreaBottom ? bottom.value : 0))

// 主题 CSS 变量只挂到当前文档的 <html>，iframe 内的组件不会把主题变量写回宿主页面。
const stopThemeMount = mountThemeToRoot({
  textColor: () => _props.textColor,
  bgColor: () => _props.bgColor,
  safeAreaBottom: () => _safeAreaBottom.value,
})

onBeforeUnmount(stopThemeMount)

</script>

<style lang="scss">
.visual-app {
  --visual-app-font-body: var(--v-font-body);
  --visual-app-text-md: var(--v-text-md);
  --visual-app-safe-area-bottom: var(--v-safe-area-bottom);
  height: 100%;
  flex: 1;
  overflow: hidden;
  color: var(--v-text-color, inherit);
  font-family: var(--visual-app-font-body);
  font-size: var(--visual-app-text-md);
  background-color: var(--v-page-background-color, transparent);

  &::after {
    content: '';
    display: block;
    height: var(--visual-app-safe-area-bottom);
  }
}
</style>
