import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualCountDownProps } from '@visual/ui/components/visual-count-down/interface'
import {
  createColorInputControl,
  createDatePickerControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualCountDown: VisualEditorComponent<VisualCountDownProps> = {
  key: 'VisualCountDown',
  moduleName: 'commerceWidgets',
  componentName: 'VisualCountDown',
  label: '倒计时',
  previewImage: '/componets/visual-count-down.svg',
  props: {
    title: createTextInputControl({ label: '前置标题', defaultValue: '距结束仅剩' }),
    endTime: createDatePickerControl({
      label: '结束时间',
      defaultValue: '2099-12-31 23:59:59',
    }),
    bgColor: createColorInputControl({ label: '数字背景色' }),
    numColor: createColorInputControl({ label: '数字颜色', defaultValue: '#ffffff' }),
    colonColor: createColorInputControl({ label: '分隔符颜色', defaultValue: '#9CA3AF' }),
    showDays: createSwitchControl({ label: '显示天数', defaultValue: false }),
  },
}

export default visualCountDown
