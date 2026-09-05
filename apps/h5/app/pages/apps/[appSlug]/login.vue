<template>
  <div class="vh-mx-auto vh-max-w-[750px]">
    <VisualLoginPanel :busy="busy" :error="error" :config="app.loginConfig" @submit="login" />
  </div>
</template>
<script setup lang="ts">
import { VisualLoginPanel } from '@visual/ui'
import { safeLoginRedirect } from '@visual/ui/types'
import type { RuntimeApp } from '../../../types/runtime'
const route = useRoute()
const slug = String(route.params.appSlug)
const { data, error: loadError } = await useFetch<RuntimeApp>('/api/runtime/app/' + encodeURIComponent(slug))
if (!data.value || loadError.value) throw createError({ statusCode: 404, statusMessage: '应用不存在或尚未发布' })
const app = computed(() => data.value!)
const { state, refresh } = useH5Auth()
await refresh()
const target = () => safeLoginRedirect(route.query.redirect, slug)
if (state.value.status === 'authenticated') await navigateTo(target(), { replace: true })
const busy = ref(false)
const error = ref('')
const login = async (credentials: { email: string; password: string }) => {
  if (busy.value) return
  busy.value = true
  error.value = ''
  try {
    const result = await useBrowserSupabase().auth.signInWithPassword(credentials)
    if (result.error) {
      error.value = result.error.code === 'invalid_credentials' ? '邮箱或密码不正确' : '登录失败，请检查账户或稍后重试'
      return
    }
    await refresh()
    if (state.value.status !== 'authenticated') {
      error.value = '登录状态确认失败，请重试'
      return
    }
    await navigateTo(target(), { replace: true })
  } catch {
    error.value = '网络异常，请稍后重试'
  } finally {
    busy.value = false
  }
}
useHead({ title: '登录 · ' + app.value.name })
</script>
