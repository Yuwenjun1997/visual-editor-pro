<template>
  <VisualApp class="vh-min-h-screen" :bg-color="app.layoutConfig.backgroundColor">
    <VisualAppLayout :layout="layout" @navigate="navigate">
      <slot />
    </VisualAppLayout>
  </VisualApp>
</template>

<script setup lang="ts">
import { useTheme } from '@visual/ui'
import type { RuntimeApp } from '../types/runtime'

const props = defineProps<{ app: RuntimeApp; activeRouteKey?: string }>()
const route = useRoute()
const { initTheme } = useTheme()

watch(
  () => props.app.themeConfig,
  (themeConfig) => initTheme(themeConfig || {}),
  { immediate: true },
)

const layout = computed(() => ({
  ...props.app.layoutConfig,
  items: props.app.layoutConfig.items.map((item) => ({
    ...item,
    active: item.routeKey === props.activeRouteKey,
  })),
}))

const navigate = (item: { routeKey: string }) => {
  const root = `/apps/${props.app.slug}`
  const target = item.routeKey === 'profile' ? `${root}/profile` : `${root}/${item.routeKey}`
  if (target !== route.path) navigateTo(target)
}
</script>
