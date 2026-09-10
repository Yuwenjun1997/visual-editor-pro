<template>
  <VisualApp
    :text-color="appTextColor"
    :bg-color="app.layoutConfig.backgroundColor"
    class="vh-min-h-screen vh-max-w-[750px] vh-mx-auto"
  >
    <VisualAppLayout :layout="layout" @navigate="navigate">
      <slot />
    </VisualAppLayout>
  </VisualApp>
</template>

<script setup lang="ts">
import { provideH5Runtime, type H5Runtime, type H5RequestConfig, type H5UserProfile } from '@visual/ui'
import type { H5DetailContext } from '@visual/ui/types'
import { useTheme } from '@visual/ui'
import type { RuntimeApp } from '../types/runtime'
import { APP_TEXT_COLOR_KEY } from '../app-context'

const props = defineProps<{
  app: RuntimeApp
  activeRouteKey?: string
  detail?: H5DetailContext
  previewToken?: string
}>()
const route = useRoute()
const { initTheme } = useTheme()
const appTextColor = computed(() => props.app.themeConfig?.textColor)
provide(APP_TEXT_COLOR_KEY, appTextColor)
const nuxtApp = useNuxtApp()
const requestFetch = useRequestFetch()

const { state, refresh, logout } = useH5Auth()
if (state.value.status === 'loading') await refresh()
const runtime: H5Runtime = {
  auth: state,
  detail: computed(() => props.detail),
  async $login() {
    if (props.previewToken) return
    await navigateTo({ path: '/apps/' + props.app.slug + '/login', query: { redirect: route.fullPath } })
  },
  $logout: logout,
  async $detail(kind, id) {
    const payload = props.previewToken
      ? await $fetch<{ item: Record<string, any> }>('/api/runtime/preview-detail/' + props.previewToken, {
          query: { kind, id },
        })
      : await $fetch<{ item: Record<string, any> }>(
          '/api/runtime/' + kind + '/' + encodeURIComponent(props.app.slug) + '/' + encodeURIComponent(id),
        )
    return payload.item
  },
  async $user(id) {
    const payload = await requestFetch<{ profile: H5UserProfile }>('/api/user/' + encodeURIComponent(id))
    return payload.profile
  },
  async $navigateTo(url, options = {}) {
    if (options.appPage) {
      const [routeKey, suffix = ''] = url.split(/(?=[?#])/, 2)
      const root = `/apps/${props.app.slug}`
      const target = routeKey === props.app.homeRouteKey ? root : `${root}/${routeKey}`
      await navigateTo(`${target}${suffix}`, { replace: options.replace })
      return
    }
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
  (themeConfig) => initTheme(themeConfig || {}),
  { immediate: true },
)

const shouldShowTabbar = computed(
  () =>
    !!props.activeRouteKey &&
    props.app.layoutConfig.items.some((item) => item.visible !== false && item.routeKey === props.activeRouteKey),
)
const layout = computed(() => ({
  ...props.app.layoutConfig,
  // 底部导航只属于被配置为可见 Item 的页面；详情页和未配置页面不渲染 Tabbar。
  showTabbar: props.app.layoutConfig.showTabbar && shouldShowTabbar.value,
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
