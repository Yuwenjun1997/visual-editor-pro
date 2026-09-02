import type { InjectionKey, Ref } from 'vue'
import type { EmblaCarouselType } from 'embla-carousel'

export const carouselNodeInjectionKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('carouselNode')

export const carouselApiInjectionKey: InjectionKey<Ref<EmblaCarouselType | undefined>> = Symbol('carouselApi')
