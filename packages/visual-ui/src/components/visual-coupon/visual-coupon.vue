<template>
  <visual-box class="visual-coupon" :styles="_props.styles">
    <div class="visual-coupon__card" :style="cardStyle">
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
</script>

<style scoped lang="scss">
.visual-coupon {
  .visual-coupon__card {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border-radius: 12px;
    background-color: var(--v-coupon-bg, #ff6b5e);
    color: var(--v-coupon-color, #fff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .visual-coupon__amount {
    display: flex;
    align-items: baseline;
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

  // 锯齿/缺口分割条
  .visual-coupon__divider {
    position: relative;
    width: 10px;
    margin: 0 -2px;
    background-image: radial-gradient(circle at 50% 16px, transparent 7px, #000 8px);
    background-size: 100% 32px;
    background-position: 0 0;

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
      color: var(--v-coupon-bg, #ff6b5e);
    }
  }
}
</style>