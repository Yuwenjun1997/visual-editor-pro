import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualCountDownProps } from '@visual/ui/components/visual-count-down/interface'
import {
  createColorInputControl,
  createDatePickerControl,
  createImageInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualCountDown: VisualEditorComponent<VisualCountDownProps> = {
  key: 'VisualCountDown',
  moduleName: 'commerceWidgets',
  componentName: 'VisualCountDown',
  label: '倒计时',
  previewImage: '/componets/visual-count-down.svg',
  souceDataType: 'VisualObject',
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
    image: createImageInputControl({ label: '左侧图片', defaultValue: '' }),
    imageWidth: createPxInputControl({ label: '图片宽度', defaultValue: '32px' }),
    variant: createNormalSelectControl({
      label: '样式变体',
      defaultValue: 'default',
      options: [
        { label: '默认渐变块', value: 'default' },
        { label: '纯色块', value: 'flat' },
        { label: '描边块', value: 'outline' },
        { label: '简约数字', value: 'plain' },
      ],
    }),
  },
}

export default visualCountDown
