<template>
  <visual-box class="visual-count-down" :styles="_props.styles" :class="_props.class">
    <div class="visual-count-down__inner" :style="innerStyle">
      <span v-if="_props.props.title" class="visual-count-down__title">
        {{ _props.props.title }}
      </span>
      <template v-if="showDays">
        <span class="visual-count-down__num">{{ days }}</span>
        <span class="visual-count-down__colon" :style="colonStyle">天</span>
      </template>
      <span class="visual-count-down__num">{{ pad(hours) }}</span>
      <span class="visual-count-down__colon" :style="colonStyle">:</span>
      <span class="visual-count-down__num">{{ pad(minutes) }}</span>
      <span class="visual-count-down__colon" :style="colonStyle">:</span>
      <span class="visual-count-down__num">{{ pad(seconds) }}</span>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualCountDownProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualCountDownProps
  class?: string
}

defineOptions({
  name: 'VisualCountDown',
})

const _props = defineProps<Props>()

const showDays = computed(() => _props.props.showDays)

const remain = ref(0)

const days = computed(() => Math.floor(remain.value / 86400))
const hours = computed(() => Math.floor((remain.value % 86400) / 3600))
const minutes = computed(() => Math.floor((remain.value % 3600) / 60))
const seconds = computed(() => remain.value % 60)

const pad = (num: number) => String(num).padStart(2, '0')

const innerStyle = computed<CSSProperties>(() => ({
  '--v-count-num-bg': _props.props.bgColor,
  '--v-count-num-color': _props.props.numColor,
  '--v-count-colon-color': _props.props.colonColor,
}))

const colonStyle = computed<CSSProperties>(() => ({
  color: _props.props.colonColor,
}))

let timer: ReturnType<typeof setInterval> | null = null

const parseEnd = () => {
  const end = _props.props.endTime
  if (!end) return 0
  const t = Number(end)
  const normalized = String(end).trim()
  // 兼容时间戳与 'YYYY-MM-DD HH:mm:ss'（空格格式在部分浏览器 Date.parse 解析不一致）
  const target =
    Number.isFinite(t) && normalized !== '' ? t : Date.parse(normalized.replace(' ', 'T'))
  return Number.isFinite(target) ? target - Date.now() : 0
}

const tick = () => {
  remain.value = Math.max(0, Math.floor(parseEnd() / 1000))
}

const startTimer = () => {
  tick()
  if (timer) clearInterval(timer)
  timer = setInterval(tick, 1000)
}

watch(
  () => _props.props.endTime,
  () => startTimer()
)

onMounted(startTimer)

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.visual-count-down {
  .visual-count-down__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .visual-count-down__title {
    margin-right: 8px;
    font-size: 14px;
    color: inherit;
  }

  .visual-count-down__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 4px;
    border-radius: var(--v-radius-moody-sm);
    font-family: var(--v-font-body);
    font-size: 16px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    background: var(--v-count-num-bg, var(--v-gradient-primary));
    color: var(--v-count-num-color, #fff);
  }

  .visual-count-down__colon {
    font-weight: 600;
    color: var(--v-count-colon-color, var(--v-text-1));
  }
}
</style>
