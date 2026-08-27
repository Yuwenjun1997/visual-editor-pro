<template>
  <visual-box class="visual-event-container" :styles="_props.styles">
    <div
      class="visual-event-container__inner"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @touchstart.passive="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchmove.passive="handleTouchMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
    >
      <slot />
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import { toast } from '../../utils/toast'
import type { VisualEventContainerProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualEventContainerProps
}

defineOptions({
  name: 'visual-event-container',
})

const _props = defineProps<Props>()

let longPressTimer: ReturnType<typeof setTimeout> | null = null
let isTouchActive = false

const LONG_PRESS_DELAY = 500

function executeAction() {
  const { actionType, actionUrl, actionText, actionCode } = _props.props

  if (!actionType || actionType === 'none') return
  if (actionType === 'url' && actionUrl) {
    const url = actionUrl.startsWith('http') ? actionUrl : `//${actionUrl}`
    window.location.href = url
  }
  if (actionType === 'toast' && actionText) {
    toast(actionText)
  }
  if (actionType === 'jscode' && actionCode) {
    try {
      new Function(actionCode)()
    } catch (e) {
      console.error('Event Container custom code error:', e)
    }
  }
}

function clearLongPressTimer() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function startLongPressTimer() {
  if (_props.props.eventType !== 'longPress') return
  clearLongPressTimer()
  longPressTimer = setTimeout(() => {
    longPressTimer = null
    executeAction()
  }, LONG_PRESS_DELAY)
}

function handleClick() {
  if (_props.props.eventType !== 'click') return
  executeAction()
}

function handleMouseEnter() {
  if (_props.props.eventType !== 'hover') return
  executeAction()
}

function handleTouchStart() {
  isTouchActive = true
  startLongPressTimer()
}

function handleTouchEnd() {
  isTouchActive = false
  clearLongPressTimer()
}

function handleTouchMove() {
  isTouchActive = false
  clearLongPressTimer()
}

function handleMouseDown() {
  if (isTouchActive) return
  startLongPressTimer()
}

function handleMouseUp() {
  if (isTouchActive) return
  clearLongPressTimer()
}

function handleMouseMove() {
  if (isTouchActive) return
  clearLongPressTimer()
}
</script>

<style scoped lang="scss">
.visual-event-container {
  width: 100%;

  .visual-event-container__inner {
    width: 100%;
  }
}
</style>
