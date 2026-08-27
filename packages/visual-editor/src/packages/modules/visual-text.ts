import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualTextProps } from '@visual/ui/components/visual-text/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualText: VisualEditorComponent<VisualTextProps> = {
  key: 'VisualText',
  moduleName: 'basicWidgets',
  componentName: 'VisualText',
  label: '文本',
  previewImage: '/componets/visual-text.svg',
  souceDataType: 'VisualObject',
  props: {
    text: createTextInputControl({ label: '文本', defaultValue: '文本内容' }),
    color: createColorInputControl({ label: '文本颜色' }),
    fontSize: createNormalSelectControl({
      label: '字体大小',
      options: [
        { label: '迷你', value: 'xs' },
        { label: '小号', value: 'sm' },
        { label: '中号', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '大号', value: 'lg' },
      ],
    }),
    textAlign: createNormalSelectControl({
      label: '对齐方式',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '右对齐', value: 'right' },
        { label: '居中对齐', value: 'center' },
        { label: '两端对齐', value: 'justify' },
      ],
    }),
    isBold: createSwitchControl({ label: '加粗' }),
    isItalic: createSwitchControl({ label: '斜体' }),
    decoration: createNormalSelectControl({
      label: '装饰线',
      options: [
        { label: '下划线', value: 'underline' },
        { label: '删除线', value: 'line-through' },
      ],
    }),
  },
}

export default visualText
