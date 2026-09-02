<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('', props.class)" class="vu-min-w-0 vu-flex-[0_0_100%]">
    <slot />
  </div>
</template>
