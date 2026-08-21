import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualButtonProps } from '#visual-ui/components/visual-button/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createTextInputControl,
} from '@/utils/visual.control'

const visualButton: VisualEditorComponent<VisualButtonProps> = {
  key: 'VisualButton',
  moduleName: 'basicWidgets',
  componentName: 'VisualButton',
  label: '按钮',
  previewImage: '/componets/visual-button.svg',
  props: {
    text: createTextInputControl({ label: '按钮文案', defaultValue: '立即领取' }),
    type: createNormalSelectControl({
      label: '按钮类型',
      defaultValue: 'primary',
      options: [
        { label: '主色', value: 'primary' },
        { label: '危险', value: 'danger' },
        { label: '警示', value: 'warning' },
        { label: '描边', value: 'outline' },
      ],
    }),
    size: createNormalSelectControl({
      label: '按钮尺寸',
      defaultValue: 'default',
      options: [
        { label: '大号', value: 'large' },
        { label: '中号', value: 'default' },
        { label: '小号', value: 'small' },
      ],
    }),
    bgColor: createColorInputControl({ label: '背景颜色' }),
    textColor: createColorInputControl({ label: '文字颜色' }),
    radius: createPxInputControl({ label: '圆角大小' }),
    link: createTextInputControl({ label: '跳转链接' }),
  },
}

export default visualButton
