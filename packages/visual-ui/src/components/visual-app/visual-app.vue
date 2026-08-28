<template>
  <div class="visual-app" :class="[_bindClassList, _props.class]">
    <slot />
    <Sonner />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../hooks/useTheme'
import { useSafeArea } from '../../hooks/useSafeArea'
import { mountThemeToRoot } from '../../hooks/useMountThemeToRoot'
import Sonner from '../../deps/toast/sonner.vue'
import type { VisualAppProps } from './interface'

defineOptions({
  name: 'v-app',
})

const _props = withDefaults(defineProps<VisualAppProps>(), {
  safeAreaBottom: true,
  bgColor: 'transparent',
})

const { themeName } = useTheme()

const { bottom } = useSafeArea()

const _safeAreaBottom = computed(() =>
  _props.safeAreaBottom ? bottom.value : 0
)

// 主题 CSS 变量挂到 <html>，供 .visual-app 子树及之外的编辑面板/teleport 弹层统一取用
mountThemeToRoot({
  bgColor: () => _props.bgColor,
  safeAreaBottom: () => _safeAreaBottom.value,
})

const _bindClassList = computed(() => ({
  [themeName.value]: true,
}))
</script>

<style lang="scss">
.visual-app {
  height: 100%;
  flex: 1;
  overflow: hidden;
  background-color: var(--v-bg-color);
  color: var(--v-text-1);
  font-family: var(--v-font-body);
  font-size: var(--v-text-md);

  &::after {
    content: '';
    display: block;
    height: var(--v-safe-area-bottom);
  }
}
</style>
