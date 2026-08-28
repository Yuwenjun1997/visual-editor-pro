<template>
  <visual-box class="visual-coupon" :styles="_props.styles" :class="_props.class">
    <div
      class="visual-coupon__card"
      :class="[layoutClass, edgeClass, themeClass]"
      :style="cardStyle"
    >
      <span
        v-if="_props.props.showBadge !== false"
        class="visual-coupon__badge"
        :style="badgeStyle"
      >
        {{ _props.props.badgeText || '限时' }}
      </span>
      <div class="visual-coupon__amount">
        <span class="visual-coupon__currency">{{ _props.props.currency }}</span>
        <span class="visual-coupon__amount-text">{{ _props.props.amountText }}</span>
      </div>
      <div class="visual-coupon__divider" />
      <div class="visual-coupon__info">
        <div class="visual-coupon__title">{{ _props.props.titleText }}</div>
        <div class="visual-coupon__condition">{{ _props.props.conditionText }}</div>
        <div
          v-if="_props.props.showBtn !== false"
          class="visual-coupon__btn"
          :style="btnStyle"
        >
          {{ _props.props.btnText }}
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualCouponProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualCouponProps
  class?: string
}

defineOptions({
  name: 'VisualCoupon',
})

const _props = defineProps<Props>()

const cardStyle = computed<CSSProperties>(() => ({
  '--v-coupon-bg': _props.props.cardBgColor,
  '--v-coupon-color': _props.props.textColor,
}))

const btnStyle = computed<CSSProperties>(() => ({
  '--v-coupon-btn-bg': _props.props.btnColor,
}))

const layoutClass = computed(() =>
  _props.props.layout === 'column' ? 'visual-coupon__card--column' : ''
)

const edgeClass = computed(() =>
  _props.props.layout !== 'column' && _props.props.edge === 'notch'
    ? 'visual-coupon__card--notch'
    : ''
)

const themeClass = computed(() => {
  const theme = _props.props.theme || 'default'
  return theme === 'default' ? '' : `visual-coupon__card--theme-${theme}`
})

const badgeStyle = computed<CSSProperties>(() => ({
  '--v-coupon-badge-bg': _props.props.badgeColor,
}))
</script>

<style scoped lang="scss">
.visual-coupon {
  .visual-coupon__card {
    position: relative;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border-radius: var(--v-radius-moody);
    background: var(--v-coupon-bg, var(--v-gradient-primary));
    color: var(--v-coupon-color, #fff);
    box-shadow: var(--v-shadow-soft);

    // 纵向布局：金额在上、信息在下
    &--column {
      flex-direction: column;

      .visual-coupon__amount {
        min-width: 0;
        padding: 18px 16px 8px;
      }

      .visual-coupon__divider {
        width: auto;
        height: 10px;
        margin: -2px 0;

        &::before {
          top: 50%;
          bottom: auto;
          left: 0;
          right: 0;
          margin-left: 0;
          margin-top: -1px;
          border-left: 0;
          border-top: 1px dashed rgba(255, 255, 255, 0.55);
        }
      }

      .visual-coupon__info {
        padding: 8px 16px 16px;
      }
    }

    // 券票口：在分隔条上下两端各打一个半圆缺口。坐标依赖金额区固定外宽
    // （border-box 下 min-width 128 即外宽），分隔条 margin-left -2 且宽 10，
    // 中心 x = 128 - 2 + 5 = 131px，勿随意改动该结构
    &--notch {
      -webkit-mask-image:
        radial-gradient(circle 13px at 131px 0, transparent 13px, #000 13.5px),
        radial-gradient(circle 13px at 131px 100%, transparent 13px, #000 13.5px);
      mask-image:
        radial-gradient(circle 13px at 131px 0, transparent 13px, #000 13.5px),
        radial-gradient(circle 13px at 131px 100%, transparent 13px, #000 13.5px);
    }

    // 配色主题：inline cardBgColor（--v-coupon-bg）优先级更高，用户自定义色仍生效
    &--theme-pink {
      --v-coupon-bg: linear-gradient(135deg, #ff6a88, #ff99ac);
      --v-coupon-btn-bg: #fff;
      --v-coupon-btn-text: #ff5c7a;
    }

    &--theme-gold {
      --v-coupon-bg: linear-gradient(135deg, #f6c445, #f08a4b);
      --v-coupon-btn-bg: #fff;
      --v-coupon-btn-text: #e07a2f;
    }

    &--theme-cool {
      --v-coupon-bg: linear-gradient(135deg, #2193b0, #6dd5ed);
      --v-coupon-btn-bg: #fff;
      --v-coupon-btn-text: #2a9dbb;
    }
  }

  // 顶部三角旗角标（位于卡片左上角）
  .visual-coupon__badge {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 6px 12px;
    border-radius: 0 0 12px 0;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    background-color: var(--v-coupon-badge-bg, var(--v-error-1));
    color: #fff;
  }

  .visual-coupon__amount {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 128px;
    padding: 20px 12px;
    font-weight: 700;

    .visual-coupon__currency {
      font-size: 18px;
    }

    .visual-coupon__amount-text {
      font-size: 40px;
      line-height: 1;
    }
  }

  // 虚线分隔条（在渐变卡上保持干净）
  .visual-coupon__divider {
    position: relative;
    width: 10px;
    margin: 0 -2px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -1px;
      border-left: 1px dashed rgba(255, 255, 255, 0.55);
    }
  }

  .visual-coupon__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px 12px;

    .visual-coupon__title {
      font-size: 15px;
      font-weight: 600;
    }

    .visual-coupon__condition {
      font-size: 12px;
      opacity: 0.85;
    }

    .visual-coupon__btn {
      min-width: 96px;
      margin-top: 4px;
      padding: 7px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      background-color: var(--v-coupon-btn-bg, #ffffff);
      color: var(--v-coupon-btn-text, var(--v-coupon-bg, var(--v-primary-1)));
    }
  }
}
</style>