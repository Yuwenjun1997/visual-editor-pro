import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualCouponProps } from '@visual/ui/components/visual-coupon/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualCoupon: VisualEditorComponent<VisualCouponProps> = {
  key: 'VisualCoupon',
  moduleName: 'commerceWidgets',
  componentName: 'VisualCoupon',
  label: '领券',
  previewImage: '/componets/visual-coupon.svg',
  props: {
    currency: createTextInputControl({ label: '货币符号', defaultValue: '¥' }),
    amountText: createTextInputControl({ label: '面额', defaultValue: '50' }),
    conditionText: createTextInputControl({ label: '门槛说明', defaultValue: '满100元可用' }),
    titleText: createTextInputControl({ label: '券名称', defaultValue: '新人立减券' }),
    btnText: createTextInputControl({ label: '按钮文案', defaultValue: '立即领取' }),
    showBtn: createSwitchControl({ label: '显示按钮', defaultValue: true }),
    layout: createNormalSelectControl({
      label: '券布局',
      defaultValue: 'row',
      options: [
        { label: '左右（金额在左）', value: 'row' },
        { label: '上下（金额在上）', value: 'column' },
      ],
    }),
    edge: createNormalSelectControl({
      label: '券票口',
      defaultValue: 'plain',
      options: [
        { label: '平滑', value: 'plain' },
        { label: '锯齿缺口', value: 'notch' },
      ],
    }),
    theme: createNormalSelectControl({
      label: '配色主题',
      defaultValue: 'default',
      options: [
        { label: '默认渐变', value: 'default' },
        { label: '糖果粉', value: 'pink' },
        { label: '奖券金', value: 'gold' },
        { label: '科技蓝', value: 'cool' },
      ],
    }),
    showBadge: createSwitchControl({ label: '显示角标', defaultValue: false }),
    badgeText: createTextInputControl({ label: '角标文案', defaultValue: '限时' }),
    badgeColor: createColorInputControl({ label: '角标颜色' }),
    cardBgColor: createColorInputControl({ label: '券背景色' }),
    textColor: createColorInputControl({ label: '券文字色' }),
    btnColor: createColorInputControl({ label: '按钮颜色' }),
  },
}

export default visualCoupon
