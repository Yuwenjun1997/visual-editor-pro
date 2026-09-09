<template>
  <section
    class="visual-user-card"
    :style="{ background: props.background }"
    :class="{ 'visual-user-card--vertical': props.layout === 'vertical' }"
  >
    <p v-if="state.status === 'loading' || loadingProfile" role="status">正在加载账户…</p>
    <p v-else-if="state.status === 'error'" role="alert">账户暂不可用，请刷新重试</p>
    <template v-else>
      <img v-if="profile?.avatar_url" alt="头像" :src="profile.avatar_url" class="visual-user-card__avatar" />
      <div v-else aria-hidden="true" class="visual-user-card__avatar visual-user-card__avatar--placeholder">☺</div>
      <div class="visual-user-card__info">
        <h2>
          {{ profile ? profile.full_name || '我的账户' : props.title || '你还未登录' }}
        </h2>
        <p>{{ profile ? '欢迎回来' : '登录后享受完整服务' }}</p>
      </div>
      <button v-if="!profile" type="button" class="visual-user-card__login" @click="runtime.$login?.()">
        {{ props.buttonText || '去登录' }}
      </button>
    </template>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useH5Runtime, type H5UserProfile } from '../../hooks/useH5Runtime'
import type { VisualUserCardProps } from './interface'
const input = withDefaults(defineProps<{ props?: VisualUserCardProps }>(), { props: () => ({}) })
const runtime = useH5Runtime()
const state = computed(() => runtime.auth?.value || { status: 'anonymous', profile: null })
const requestedUserId = computed(() => input.props.userId?.trim() || '')
const queriedProfile = ref<H5UserProfile | null>(null)
const loadingProfile = ref(false)
const error = ref('')
const profile = computed(() => queriedProfile.value || state.value.profile)
let requestSequence = 0

const loadProfile = async () => {
  const sequence = ++requestSequence
  queriedProfile.value = null
  error.value = ''
  if (!requestedUserId.value || requestedUserId.value === state.value.profile?.id) return
  if (runtime.editor) {
    queriedProfile.value = {
      id: requestedUserId.value,
      full_name: '预览用户',
      avatar_url: null,
      role: 'viewer',
    }
    return
  }
  if (!runtime.$user) {
    error.value = '当前运行环境不支持用户资料查询'
    return
  }
  loadingProfile.value = true
  try {
    const result = await runtime.$user(requestedUserId.value)
    if (sequence === requestSequence) queriedProfile.value = result
  } catch {
    if (sequence === requestSequence) error.value = '用户资料不存在或无查看权限'
  } finally {
    if (sequence === requestSequence) loadingProfile.value = false
  }
}

watch([requestedUserId, () => state.value.profile?.id], loadProfile, { immediate: true })
</script>

<style scoped lang="scss">
.visual-user-card {
  --visual-user-card-primary-color: var(--v-primary-color);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  color: #1e293b;

  &--vertical {
    flex-direction: column;
    text-align: center;
  }
  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__avatar--placeholder {
    display: grid;
    place-items: center;
    background: #eef2ff;
    color: #4f46e5;
    font-size: 24px;
  }
  &__info {
    flex: 1;
    min-width: 0;
  }
  &__info h2 {
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__info p {
    margin-top: 4px;
    color: #64748b;
    font-size: 14px;
  }
  &__login {
    margin-left: auto;
    flex: none;
    border: 0;
    border-radius: 8px;
    background: var(--visual-user-card-primary-color, #4f46e5);
    color: #fff;
    cursor: pointer;
    padding: 8px 12px;
    font-size: 14px;
  }
  &--vertical &__login {
    margin-left: 0;
  }
}

@media (min-width: 768px) {
  .visual-user-card {
    gap: 16px;
    padding: 20px;
    border-radius: 16px;
  }
  .visual-user-card__avatar {
    width: 56px;
    height: 56px;
  }
  .visual-user-card__avatar--placeholder {
    font-size: 28px;
  }
  .visual-user-card__info h2 {
    font-size: 18px;
  }
}
</style>
