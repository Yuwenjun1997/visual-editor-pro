<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-flash-sale">
    <div :style="innerStyle" class="visual-flash-sale__inner">
      <div class="visual-flash-sale__head">
        <div class="visual-flash-sale__title-wrap">
          <i class="bi bi-lightning-charge-fill visual-flash-sale__title-icon" />
          <span class="visual-flash-sale__title">{{ title || '限时秒杀' }}</span>
        </div>
        <div class="visual-flash-sale__countdown">
          <template v-if="showDays">
            <span class="visual-flash-sale__num">{{ days }}</span>
            <span class="visual-flash-sale__colon">天</span>
          </template>
          <span class="visual-flash-sale__num">{{ pad(hours) }}</span>
          <span class="visual-flash-sale__colon">:</span>
          <span class="visual-flash-sale__num">{{ pad(minutes) }}</span>
          <span class="visual-flash-sale__colon">:</span>
          <span class="visual-flash-sale__num">{{ pad(seconds) }}</span>
        </div>
      </div>
      <div class="visual-flash-sale__body">
        <div class="visual-flash-sale__prices">
          <span class="visual-flash-sale__price">{{ priceText }}</span>
          <span v-if="originPriceText" class="visual-flash-sale__origin">
            {{ originPriceText }}
          </span>
        </div>
        <div class="visual-flash-sale__progress-wrap">
          <span class="visual-flash-sale__progress-label">已抢 {{ soldPercent }}%</span>
          <div class="visual-flash-sale__progress">
            <div :style="{ width: `${soldPercent}%` }" class="visual-flash-sale__progress-bar" />
          </div>
        </div>
        <a :href="href" target="_blank" rel="noopener noreferrer" class="visual-flash-sale__btn" @click="handleClick">
          {{ buttonText || '立即抢购' }}
        </a>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import { formatPrice } from '../../utils/format'
import type { VisualFlashSaleProps } from './interface'
import { navigateVisualUrl } from '../../utils/url'
import { useH5Runtime } from '../../hooks/useH5Runtime'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualFlashSaleProps
  class?: string
}

defineOptions({
  name: 'VisualFlashSale',
})

const _props = defineProps<Props>()
const runtime = useH5Runtime()

const title = computed(() => _props.props.title || '')
const buttonText = computed(() => _props.props.buttonText || '')

const priceText = computed(() => formatPrice(_props.props.price))

const originPriceText = computed(() => {
  const origin = _props.props.originPrice
  return origin != null && origin !== '' ? formatPrice(origin) : ''
})

const soldPercent = computed(() => {
  const sold = Number(_props.props.soldNum)
  const total = Number(_props.props.totalNum)
  if (!Number.isFinite(total) || total <= 0) return 0
  return Math.min(100, Math.round((sold / total) * 100))
})

const href = computed(() => {
  return undefined
})

const handleClick = (event: MouseEvent) => {
  event.preventDefault()
  if (_props.props.buyLink) navigateVisualUrl(_props.props.buyLink, runtime)
}

const innerStyle = computed<CSSProperties>(() => ({
  '--v-flash-bg': _props.props.bgColor,
  '--v-flash-num-bg': _props.props.numColor,
}))

// —— 倒计时：与 visual-count-down 同一套解析/计时逻辑 ——
const showDays = computed(() => _props.props.showDays)
const remain = ref(0)

const days = computed(() => Math.floor(remain.value / 86400))
const hours = computed(() => Math.floor((remain.value % 86400) / 3600))
const minutes = computed(() => Math.floor((remain.value % 3600) / 60))
const seconds = computed(() => remain.value % 60)

const pad = (num: number) => String(num).padStart(2, '0')

const parseEnd = () => {
  const end = _props.props.endTime
  if (!end) return 0
  const t = Number(end)
  const normalized = String(end).trim()
  const target = Number.isFinite(t) && normalized !== '' ? t : Date.parse(normalized.replace(' ', 'T'))
  return Number.isFinite(target) ? target - Date.now() : 0
}

const tick = () => {
  remain.value = Math.max(0, Math.floor(parseEnd() / 1000))
}

let timer: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
  tick()
  if (timer) clearInterval(timer)
  timer = setInterval(tick, 1000)
}

watch(
  () => _props.props.endTime,
  () => startTimer(),
)

onMounted(startTimer)

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.visual-flash-sale {
  .visual-flash-sale__inner {
    padding: 14px 16px;
    background: var(--v-flash-bg, linear-gradient(120deg, #ff4d6a, #ff6f5e));
    color: #fff;
  }

  .visual-flash-sale__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .visual-flash-sale__title-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .visual-flash-sale__title-icon {
    font-size: 18px;
  }

  .visual-flash-sale__title {
    font-size: 16px;
    font-weight: 700;
  }

  .visual-flash-sale__countdown {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .visual-flash-sale__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 4px;
    border-radius: var(--v-radius-moody-sm);
    font-family: var(--v-font-body);
    font-size: 15px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    background: var(--v-flash-num-bg, rgba(0, 0, 0, 0.35));
    color: #fff;
  }

  .visual-flash-sale__colon {
    font-weight: 600;
    opacity: 0.85;
  }

  .visual-flash-sale__body {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
  }

  .visual-flash-sale__prices {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-shrink: 0;
  }

  .visual-flash-sale__price {
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .visual-flash-sale__origin {
    font-size: 12px;
    text-decoration: line-through;
    opacity: 0.75;
  }

  .visual-flash-sale__progress-wrap {
    flex: 1;
    min-width: 0;
    margin-top: 2px;
  }

  .visual-flash-sale__progress-label {
    display: block;
    margin-bottom: 5px;
    font-size: 11px;
    opacity: 0.9;
  }

  .visual-flash-sale__progress {
    overflow: hidden;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.3);
  }

  .visual-flash-sale__progress-bar {
    height: 100%;
    border-radius: 999px;
    background: #fff;
    transition: width 0.3s;
  }

  .visual-flash-sale__btn {
    flex-shrink: 0;
    padding: 9px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    background: #fff;
    color: var(--v-flash-bg, #ff4d6a);
    box-shadow: var(--v-shadow-soft);
  }
}
</style>
