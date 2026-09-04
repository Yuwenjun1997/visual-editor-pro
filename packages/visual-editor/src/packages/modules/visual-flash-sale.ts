import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualFlashSaleProps } from '@visual/ui/components/visual-flash-sale/interface'
import {
  createColorInputControl,
  createDatePickerControl,
  createNumberInputControl,
  createSwitchControl,
  createTextInputControl,
  createUrlInputControl,
} from '../../utils/visual.control'

const visualFlashSale: VisualEditorComponent<VisualFlashSaleProps> = {
  key: 'VisualFlashSale',
  moduleName: 'commerceWidgets',
  componentName: 'VisualFlashSale',
  label: '限时秒杀',
  previewImage: '/componets/visual-flash-sale.svg',
  souceDataType: 'VisualObject',
  props: {
    title: createTextInputControl({ label: '标题', defaultValue: '限时秒杀' }),
    endTime: createDatePickerControl({
      label: '结束时间',
      tips: '支持时间戳或日期时间',
    }),
    showDays: createSwitchControl({ label: '显示天数', defaultValue: false }),
    price: createNumberInputControl({ label: '秒杀价', defaultValue: 59.9 }),
    originPrice: createNumberInputControl({ label: '原价', defaultValue: 99 }),
    soldNum: createNumberInputControl({ label: '已抢数量', defaultValue: 680 }),
    totalNum: createNumberInputControl({ label: '总数', defaultValue: 1000 }),
    bgColor: createColorInputControl({ label: '背景颜色' }),
    numColor: createColorInputControl({ label: '数字块颜色' }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '立即抢购' }),
    buyLink: createUrlInputControl({ label: '跳转链接' }),
    currency: createTextInputControl({ label: '货币符号', defaultValue: '¥' }),
  },
}

export default visualFlashSale
