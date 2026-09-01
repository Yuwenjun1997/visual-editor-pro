<script setup lang="ts">
import { computed } from 'vue'
import type { EmblaOptionsType } from 'embla-carousel'
import { Carousel, CarouselContent } from '../../deps/embla'
import type { VisualScrollXProps } from './interface'

defineOptions({
  name: 'VisualScrollX',
})

const _props = withDefaults(defineProps<VisualScrollXProps>(), {})

const boundOpts = computed<EmblaOptionsType>(() => ({
  align: 'start',
  containScroll: 'trimSnaps',
  dragFree: true,
  ..._props.opts,
}))
</script>

<template>
  <carousel :opts="boundOpts">
    <carousel-content>
      <slot />
    </carousel-content>
  </carousel>
</template>
