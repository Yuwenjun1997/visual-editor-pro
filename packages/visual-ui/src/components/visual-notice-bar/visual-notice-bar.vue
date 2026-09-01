<template>
  <visual-box
    class="visual-notice-bar"
    :styles="_props.styles"
    :class="_props.class"
  >
    <div
      class="visual-notice-bar__inner"
      :style="innerStyle"
    >
      <i class="bi bi-megaphone-fill visual-notice-bar__horn" />
      <div class="visual-notice-bar__viewport">
        <div class="visual-notice-bar__track">
          <span class="visual-notice-bar__text">{{ _props.props.text }}</span>
          <span class="visual-notice-bar__text">{{ _props.props.text }}</span>
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualNoticeBarProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualNoticeBarProps
  class?: string
}

defineOptions({
  name: 'VisualNoticeBar',
})

const _props = defineProps<Props>()

const duration = computed(() => {
  const speed = Number(_props.props.speed)
  return Number.isFinite(speed) && speed > 0 ? speed : 10
})

const innerStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    '--v-notice-duration': `${duration.value}s`,
  }
  if (_props.props.bgColor) style['--v-notice-bg'] = _props.props.bgColor
  if (_props.props.textColor) style['--v-notice-color'] = _props.props.textColor
  if (_props.props.radius) style.borderRadius = _props.props.radius
  return style
})
</script>

<style scoped lang="scss">
.visual-notice-bar {
  .visual-notice-bar__inner {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    padding: 9px 12px;
    border-radius: var(--v-radius-moody-sm);
    background: var(--v-notice-bg, linear-gradient(135deg, #2b3a67, #5b6fb8));
    color: var(--v-notice-color, #fff);
  }

  .visual-notice-bar__horn {
    flex-shrink: 0;
    font-size: 15px;
    opacity: 0.9;
  }

  .visual-notice-bar__viewport {
    flex: 1;
    overflow: hidden;
  }

  // 两段重复文本组成轨道，横移 -50% 即完整一轮，衔接无缝
  .visual-notice-bar__track {
    display: inline-flex;
    white-space: nowrap;
    animation: visual-notice-marquee var(--v-notice-duration) linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  .visual-notice-bar__text {
    padding-right: 44px;
    font-size: 14px;
    line-height: 1.4;
  }
}

@keyframes visual-notice-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
