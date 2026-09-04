<template>
  <VisualApp :bg-color="app.layoutConfig.backgroundColor" class="vh-min-h-screen vh-max-w-[750px] vh-mx-auto">
    <VisualAppLayout :layout="layout" @navigate="navigate">
      <slot />
    </VisualAppLayout>
  </VisualApp>
</template>

<script setup lang="ts">
import { provideH5Runtime, type H5Runtime, type H5RequestConfig } from '@visual/ui'
import type { CustomThemeConfig } from '@visual/ui/types'
import { useTheme } from '@visual/ui'
import type { RuntimeApp } from '../types/runtime'

const props = defineProps<{ app: RuntimeApp; activeRouteKey?: string }>()
const route = useRoute()
const { initTheme } = useTheme()
const nuxtApp = useNuxtApp()

// H5 不依赖编辑器包；在这里注册编辑器 schema 可选的内置页面主题，
// 使 `schema.themeName` 在运行时能解析为实际的 CSS 变量。
const pageThemeConfig: CustomThemeConfig = {
  theme: {
    'theme-blue': { primary: '#4F46E5', warning: '#D97706', success: '#0F9D6E', error: '#E5484D', info: '#0284C7' },
    'theme-green': { primary: '#0F9D6E', warning: '#D97706', success: '#0F9D6E', error: '#E5484D', info: '#0284C7' },
    'theme-orange': { primary: '#D97706', warning: '#D97706', success: '#0F9D6E', error: '#E5484D', info: '#0284C7' },
    'theme-red': { primary: '#E5484D', warning: '#D97706', success: '#0F9D6E', error: '#E5484D', info: '#0284C7' },
    'theme-purple': { primary: '#7C3AED', warning: '#D97706', success: '#0F9D6E', error: '#E5484D', info: '#0284C7' },
  },
}

const runtime: H5Runtime = {
  async $navigateTo(url, options = {}) {
    let parsed: URL
    try {
      parsed = new URL(url, window.location.href)
    } catch {
      if (import.meta.dev) console.warn('[h5] Invalid navigation URL:', url)
      return
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      if (import.meta.dev) console.warn('[h5] Unsafe navigation URL:', url)
      return
    }
    if (parsed.origin === window.location.origin && parsed.pathname.startsWith('/')) {
      await navigateTo(`${parsed.pathname}${parsed.search}${parsed.hash}`, { replace: options.replace })
      return
    }
    window.location.assign(parsed.href)
  },
  $request<T = any>(config: H5RequestConfig) {
    return (nuxtApp.$fetch as any)(config.url, {
      method: config.method || 'GET',
      query: config.params,
      body: config.body,
      headers: config.headers,
    }) as Promise<T>
  },
  $emit(name, payload = {}, context = {}) {
    const item = payload.item as Record<string, any> | undefined
    if (name === 'product:click' && item?.id) {
      void navigateTo(`/apps/${props.app.slug}/product/${item.id}`)
      return
    }
    if (name === 'article:click' && item?.id) {
      void navigateTo(`/apps/${props.app.slug}/article/${item.id}`)
      return
    }
    if (import.meta.dev) console.warn(`[h5] Unhandled visual event "${name}"`, { ...context, ...payload })
  },
}

provideH5Runtime(runtime)

watch(
  () => props.app.themeConfig,
  (themeConfig) =>
    initTheme({
      ...pageThemeConfig,
      ...(themeConfig || {}),
      theme: { ...pageThemeConfig.theme, ...themeConfig?.theme },
    }),
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
