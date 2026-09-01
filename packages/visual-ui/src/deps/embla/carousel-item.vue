<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    class="vu-min-w-0 vu-flex-[0_0_100%]"
    :class="cn('', props.class)"
  >
    <slot />
  </div>
</template>
