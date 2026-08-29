<template>
  <visual-box class="visual-count-down" :styles="_props.styles" :class="_props.class">
    <div class="visual-count-down__inner" :style="innerStyle" :class="variantClass">
      <img
        v-if="_props.props.image"
        class="visual-count-down__image"
        :src="_props.props.image"
        :style="imageStyle"
      />
      <span v-if="_props.props.title" class="visual-count-down__title">
        {{ _props.props.title }}
      </span>
      <template v-if="showDays">
        <span class="visual-count-down__num">{{ days }}</span>
        <span class="visual-count-down__colon" :style="colonStyle">天</span>
      </template>
      <span class="visual-count-down__num">{{ pad(hours) }}</span>
      <span class="visual-count-down__colon" :style="colonStyle">{{ hSep }}</span>
      <span class="visual-count-down__num">{{ pad(minutes) }}</span>
      <span class="visual-count-down__colon" :style="colonStyle">{{ mSep }}</span>
      <span class="visual-count-down__num">{{ pad(seconds) }}</span>
      <span v-if="isPlain" class="visual-count-down__colon" :style="colonStyle">秒</span>
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

const variant = computed(() => _props.props.variant || 'default')
const isPlain = computed(() => variant.value === 'plain')
const variantClass = computed(() =>
  variant.value === 'default' ? '' : `visual-count-down__inner--${variant.value}`
)
const imageStyle = computed<CSSProperties>(() => ({
  '--v-count-img-width': _props.props.imageWidth || '32px',
}))
// 简约数字模式用 时/分/秒 文字单位替代冒号
const hSep = computed(() => (isPlain.value ? '时' : ':'))
const mSep = computed(() => (isPlain.value ? '分' : ':'))

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

  .visual-count-down__image {
    width: var(--v-count-img-width, 32px);
    height: auto;
    object-fit: contain;
    flex-shrink: 0;
    margin-right: 8px;
    vertical-align: middle;
  }

  // 纯色块：双停同色渐变表现为实色；用户 bgColor inline 覆盖后即为该色实块
  .visual-count-down__inner--flat {
    --v-count-num-bg: linear-gradient(135deg, #4f46e5 0%, #4f46e5 100%);
  }

  // 描边块：透明底 + 彩色描边，数字为同色
  .visual-count-down__inner--outline {
    --v-count-colon-color: #4f46e5;

    .visual-count-down__num {
      background: transparent;
      border: 1px solid var(--v-count-num-bg, #4f46e5);
      color: var(--v-count-num-color, #4f46e5);
    }
  }

  // 简约数字：无块无描边，大号数字 + 文字单位
  .visual-count-down__inner--plain {
    .visual-count-down__num {
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0;
      min-width: 0;
      font-size: 20px;
      color: var(--v-count-num-color, #111827);
    }

    .visual-count-down__colon {
      margin: 0 2px;
      font-size: 14px;
      color: var(--v-count-colon-color, var(--v-text-1));
    }
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
