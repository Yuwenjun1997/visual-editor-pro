<template>
  <section>
    <div v-if="runtime.editor" class="v-auth-preview">
      <label>
        模拟身份
        <select v-model="simulation">
          <option value="anonymous">未登录</option>
          <option value="viewer">普通用户</option>
          <option value="editor">编辑者</option>
          <option value="admin">管理员</option>
        </select>
      </label>
      <span>{{ allowed ? '允许显示' : '无权限：下方为替代内容' }}</span>
    </div>
    <slot v-if="allowed" />
    <slot v-else-if="state.status !== 'loading' && state.status !== 'error'" name="fallback" />
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useH5Runtime, type H5AuthState } from '../../hooks/useH5Runtime'
import { canDisplay } from '../../utils/auth'
import type { VisualAuthGuardProps } from './interface'
const input = withDefaults(defineProps<{ props?: VisualAuthGuardProps }>(), {
  props: () => ({ login: 'authenticated', mode: 'all' }),
})
const runtime = useH5Runtime()
const simulation = ref('viewer')
const state = computed<H5AuthState>(() =>
  runtime.editor
    ? {
        status: simulation.value === 'anonymous' ? 'anonymous' : 'authenticated',
        profile: { id: 'preview', role: simulation.value },
      }
    : runtime.auth?.value || { status: 'anonymous', profile: null },
)
const allowed = computed(() => canDisplay(state.value, input.props))
</script>
