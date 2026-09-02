<script setup lang="ts">
import { inject } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import { carouselNodeInjectionKey } from './use-carousel'

interface Props {
  class?: HTMLAttributes['class']
  /* 垂直排列时 track 需 flex-col（embla axis:'y'） */
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  vertical: false,
})

const nodeRef = inject(carouselNodeInjectionKey)!
</script>

<template>
  <div ref="nodeRef" class="vu-h-full vu-overflow-hidden">
    <div class="vu-flex vu-h-full" :class="cn(props.vertical ? 'vu-flex-col' : '', props.class)">
      <slot />
    </div>
  </div>
</template>
