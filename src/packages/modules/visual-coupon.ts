import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualCouponProps } from '#visual-ui/components/visual-coupon/interface'
import {
  createColorInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'

const visualCoupon: VisualEditorComponent<VisualCouponProps> = {
  key: 'VisualCoupon',
  moduleName: 'serviceWidgets',
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
    cardBgColor: createColorInputControl({ label: '券背景色', defaultValue: '#ff6b5e' }),
    textColor: createColorInputControl({ label: '券文字色', defaultValue: '#ffffff' }),
    btnColor: createColorInputControl({ label: '按钮颜色', defaultValue: '#ffffff' }),
  },
}

export default visualCoupon