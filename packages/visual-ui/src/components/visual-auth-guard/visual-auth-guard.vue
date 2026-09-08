<template>
  <section>
    <slot v-if="allowed" />
    <slot v-else-if="state.status !== 'loading' && state.status !== 'error'" name="fallback" />
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useH5Runtime, type H5AuthState } from '../../hooks/useH5Runtime'
import { canDisplay } from '../../utils/auth'
import type { VisualAuthGuardProps } from './interface'
const input = withDefaults(defineProps<{ props?: VisualAuthGuardProps }>(), {
  props: () => ({ login: 'authenticated', mode: 'all' }),
})
const runtime = useH5Runtime()
const state = computed<H5AuthState>(() => runtime.auth?.value || { status: 'anonymous', profile: null })
const allowed = computed(() => canDisplay(state.value, input.props))
</script>
