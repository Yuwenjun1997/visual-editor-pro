<template>
  <visual-box
    class="visual-audio"
    :styles="_props.styles"
    :class="_props.class"
  >
    <div
      class="visual-audio__inner"
      :style="innerStyle"
    >
      <div
        v-if="title"
        class="visual-audio__title"
      >
        <i class="bi bi-music-note-beamed visual-audio__title-icon" />
        <span>{{ title }}</span>
      </div>
      <audio
        class="visual-audio__player"
        :src="_props.props.src"
        :autoplay="_props.props.autoplay"
        :loop="_props.props.loop"
        :controls="_props.props.controls !== false"
      />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualAudioProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualAudioProps
  class?: string
}

defineOptions({
  name: 'VisualAudio',
})

const _props = defineProps<Props>()

const title = computed(() => _props.props.title || '')

const innerStyle = computed<CSSProperties>(() => ({
  '--v-audio-width': _props.props.width || '100%',
  '--v-audio-round': _props.props.round || '0px',
}))
</script>

<style scoped lang="scss">
.visual-audio {
  .visual-audio__inner {
    width: var(--v-audio-width, 100%);
  }

  .visual-audio__title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--v-text-1, #2b2f3a);
  }

  .visual-audio__title-icon {
    color: var(--v-primary-1, #4f6ef7);
  }

  .visual-audio__player {
    display: block;
    width: 100%;
    height: 44px;
    border-radius: var(--v-audio-round, 0);
  }
}
</style>
