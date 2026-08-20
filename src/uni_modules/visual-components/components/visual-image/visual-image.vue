<template>
  <visual-box class="visual-image" :styles="_props.styles">
    <div class="visual-image__inner" :style="_bindInnerStyles">
      <img
        class="visual-image__img"
        :src="_bindProps.src"
        :style="_bindImageStyles"
      />
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
}

const _props = defineProps<Props>()

const _bindProps = computed(() => _props.props)

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-image-width': _bindProps.value.width,
  '--v-image-height': _bindProps.value.height,
  '--v-image-radius': cssRadiusVar(_bindProps.value.round),
  '--v-image-align': _bindProps.value.align,
}))

const _bindImageStyles = computed<CSSProperties>(() => {
  const modeMap: Record<string, string> = {
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
    justify-content: var(--v-image-align, flex-start);
    .visual-image__img {
      display: block;
      width: var(--v-image-width, 100%);
      height: var(--v-image-height, 360px);
      border-radius: var(--v-image-radius);
      overflow: hidden;
    }
  }
}
</style>
