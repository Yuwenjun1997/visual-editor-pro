<template>
  <main class="vh-mx-auto vh-max-w-md vh-p-6">
    <template v-if="profile">
      <img v-if="profile.avatar_url" alt="头像" :src="profile.avatar_url" class="vh-h-16 vh-w-16 vh-rounded-full" />
      <h1 class="vh-text-xl vh-font-semibold">{{ profile.full_name || '我的账户' }}</h1>
      <button class="vh-rounded vh-border vh-px-4 vh-py-2" @click="signOut">退出登录</button>
    </template>
    <form v-else class="vh-space-y-3" @submit.prevent="signIn">
      <h1 class="vh-text-xl vh-font-semibold">登录</h1>
      <input v-model="email" required type="email" placeholder="邮箱" class="vh-w-full vh-rounded vh-border vh-p-2" />
      <input
        v-model="password"
        required
        type="password"
        placeholder="密码"
        class="vh-w-full vh-rounded vh-border vh-p-2"
      />
      <p v-if="error" class="vh-text-sm vh-text-red-600">{{ error }}</p>
      <button :disabled="submitting" class="vh-rounded vh-bg-blue-600 vh-px-4 vh-py-2 vh-text-white">
        {{ submitting ? '登录中…' : '登录' }}
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}
const { data, refresh } = await useFetch<{ profile: Profile | null }>('/api/me')
const profile = computed(() => data.value?.profile || null)
const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

const signIn = async () => {
  submitting.value = true
  error.value = ''
  const { error: authError } = await useBrowserSupabase().auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  submitting.value = false
  if (authError) {
    error.value = authError.message
    return
  }
  await refresh()
}

const signOut = async () => {
  await useBrowserSupabase().auth.signOut()
  await refresh()
}
</script>
