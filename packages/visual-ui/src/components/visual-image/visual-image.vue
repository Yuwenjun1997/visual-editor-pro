<template>
  <visual-box class="visual-image" :class="_props.class" :styles="_props.styles">
    <div :style="_bindInnerStyles" class="visual-image__inner">
      <img :src="_bindProps.src" class="visual-image__img" :style="_bindImageStyles" />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualImageProps } from './interface'
import { cssRadiusVar } from '../../utils/styles.utils'

interface Props {
  props: VisualImageProps
  styles: CSSProperties
  class?: string
}

const _props = defineProps<Props>()

const _bindProps = computed(() => _props.props)

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--visual-image-image-width': _bindProps.value.width,
  '--visual-image-image-height': _bindProps.value.height,
  '--visual-image-image-radius': cssRadiusVar(_bindProps.value.round),
  '--visual-image-image-align': _bindProps.value.align,
}))

const _bindImageStyles = computed<CSSProperties>(() => {
  const modeMap: Record<string, CSSProperties['objectFit']> = {
    aspectFill: 'cover',
    aspectFit: 'contain',
    scaleToFill: 'fill',
  }
  const objectFit = modeMap[_bindProps.value.mode || ''] || 'cover'
  return { objectFit }
})
</script>

<style scoped lang="scss">
.visual-image {
  .visual-image__inner {
    display: flex;
    justify-content: var(--visual-image-image-align, flex-start);
    .visual-image__img {
      display: block;
      width: var(--visual-image-image-width, 100%);
      height: var(--visual-image-image-height, 180px);
      border-radius: var(--visual-image-image-radius);
      overflow: hidden;
    }
  }
}
</style>
