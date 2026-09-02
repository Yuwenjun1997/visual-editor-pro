<template>
  <visual-box class="visual-video" :class="_props.class" :styles="_props.styles">
    <div :style="_bindInnerStyles" class="visual-video__inner">
      <video
        :src="_bindProps.src"
        :loop="_bindProps.loop"
        :muted="_bindProps.muted"
        :title="_bindProps.title"
        class="visual-video__video"
        :autoplay="_bindProps.autoplay"
        :controls="_bindProps.controls"
        :object-fit="_bindProps.objectFit"
        :show-play-btn="_bindProps.showPlayBtn"
        :show-progress="_bindProps.showProgress"
        :show-fullscreen-btn="_bindProps.showFullscreenBtn"
      />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualVideoProps } from './interface'
import { cssRadiusVar } from '../../utils/styles.utils'

interface Props {
  styles?: CSSProperties
  props: VisualVideoProps
  class?: string
}

const _props = defineProps<Props>()

const _bindProps = computed(() => _props.props)

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-video-width': _bindProps.value.width,
  '--v-video-height': _bindProps.value.height,
  '--v-video-radius': cssRadiusVar(_bindProps.value.round),
  '--v-video-align': _bindProps.value.align,
}))
</script>

<style scoped lang="scss">
.visual-video {
  .visual-video__inner {
    display: flex;
    justify-content: var(--v-video-align, flex-start);
    .visual-video__video {
      display: block;
      width: var(--v-video-width, 100%);
      height: var(--v-video-height, 180px);
      border-radius: var(--v-video-radius);
      overflow: hidden;
    }
  }
}
</style>
