import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualSectionProps } from '@/uni_modules/visual-components/components/visual-section/interface'
import {
  createColorInputControl,
  createIconInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'

const VisualSection: VisualEditorComponent<VisualSectionProps> = {
  key: 'VisualSection',
  moduleName: 'basicWidgets',
  componentName: 'VisualSection',
  label: '标题栏',
  previewImage: '/image/block.svg',
  props: {
    title: createTextInputControl({ label: '标题', defaultValue: '标题栏' }),
    titleColor: createColorInputControl({ label: '标题颜色' }),
    titleSize: createNormalSelectControl({
      label: '字体大小',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
      defaultValue: 'base',
    }),

    bold: createSwitchControl({ label: '标题加粗', defaultValue: false }),

    description: createTextInputControl({ label: '描述信息' }),
    descriptionColor: createColorInputControl({ label: '描述信息颜色' }),
    descriptionSize: createNormalSelectControl({
      label: '描述信息大小',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
      defaultValue: 'sm',
    }),

    icon: createIconInputControl({ label: '图标' }),
    iconColor: createColorInputControl({ label: '图标颜色' }),

    lineColor: createColorInputControl({ label: '线条颜色' }),
    showLine: createSwitchControl({ label: '显示线条', defaultValue: true }),
    lineWidth: createPxInputControl({ label: '线条宽度' }),
  },
}

export default VisualSection
