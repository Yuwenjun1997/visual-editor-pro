<template>
  <section
    class="v-user-card"
    :style="{ background: props.background }"
    :class="{ 'v-user-card--vertical': props.layout === 'vertical' }"
  >
    <p v-if="state.status === 'loading'" role="status">正在加载账户…</p>
    <p v-else-if="state.status === 'error'" role="alert">账户暂不可用，请刷新重试</p>
    <template v-else>
      <img v-if="state.profile?.avatar_url" alt="头像" :src="state.profile.avatar_url" />
      <div v-else aria-hidden="true" class="v-user-avatar">☺</div>
      <div class="v-user-info">
        <h2>
          {{ state.status === 'authenticated' ? state.profile?.full_name || '我的账户' : props.title || '你还未登录' }}
        </h2>
        <p>{{ state.status === 'authenticated' ? '欢迎回来' : '登录后享受完整服务' }}</p>
      </div>
      <div class="v-user-actions">
        <template v-if="state.status === 'authenticated'">
          <button @click="runtime.$navigateTo('profile', { appPage: true })">个人中心</button>
          <button :disabled="busy" @click="logout">退出登录</button>
        </template>
        <button v-else @click="runtime.$login?.()">{{ props.buttonText || '去登录' }}</button>
      </div>
    </template>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useH5Runtime } from '../../hooks/useH5Runtime'
import type { VisualUserCardProps } from './interface'
withDefaults(defineProps<{ props?: VisualUserCardProps }>(), { props: () => ({}) })
const runtime = useH5Runtime()
const state = computed(() => runtime.auth?.value || { status: 'anonymous', profile: null })
const busy = ref(false)
const error = ref('')
const logout = async () => {
  if (busy.value) return
  busy.value = true
  error.value = ''
  try {
    await runtime.$logout?.()
  } catch {
    error.value = '退出失败，请重试'
  } finally {
    busy.value = false
  }
}
</script>
