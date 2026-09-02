<script setup lang="ts">
import { computed, onBeforeUnmount, provide, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '../../utils/cn'
import { carouselApiInjectionKey, carouselNodeInjectionKey } from './use-carousel'

export interface CarouselProps {
  class?: string
  opts?: EmblaOptionsType
  autoplay?: boolean
  autoplayDelay?: number
}

const props = withDefaults(defineProps<CarouselProps>(), {
  autoplayDelay: 3000,
})

const emit = defineEmits<{
  (e: 'slide-change', index: number): void
}>()

const nodeRef: Ref<HTMLElement | undefined> = shallowRef()
const apiRef: Ref<EmblaCarouselType | undefined> = shallowRef()

provide(carouselNodeInjectionKey, nodeRef)
provide(carouselApiInjectionKey, apiRef)

// skipAutoplay: set when structure opts change so autoplay won't race reInit
const plugins = computed(() =>
  props.autoplay
    ? [
        Autoplay({
          delay: props.autoplayDelay,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]
    : [],
)

let api: EmblaCarouselType | undefined

const syncIndex = () => {
  if (api) emit('slide-change', api.selectedScrollSnap())
}

watch(
  nodeRef,
  (node) => {
    if (api) api.destroy()
    api = node ? EmblaCarousel(node, props.opts, plugins.value) : undefined
    apiRef.value = api
    if (api) {
      syncIndex()
      api.on('select', syncIndex)
      api.on('reInit', syncIndex)
      api.on('slidesChanged', syncIndex)
    }
  },
  { flush: 'post' },
)

watch(
  () => [props.opts, props.autoplay, props.autoplayDelay] as const,
  () => {
    api?.reInit(props.opts, plugins.value)
  },
)

onBeforeUnmount(() => api?.destroy())
</script>

<template>
  <div :class="cn('', props.class)" class="vu-relative vu-w-full">
    <slot />
  </div>
</template>
