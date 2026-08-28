import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualSearchProps } from '@visual/ui/components/visual-search/interface'
import {
  createColorInputControl,
  createPxInputControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualSearch: VisualEditorComponent<VisualSearchProps> = {
  key: 'VisualSearch',
  moduleName: 'basicWidgets',
  componentName: 'VisualSearch',
  label: '搜索框',
  previewImage: '/componets/visual-search.svg',
  props: {
    placeholder: createTextInputControl({
      label: '占位文案',
      defaultValue: '搜索商品 / 店铺',
    }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '搜索' }),
    buttonColor: createColorInputControl({
      label: '按钮颜色',
      defaultValue: '#2563EB',
    }),
    radius: createPxInputControl({ label: '圆角大小' }),
    confirmLink: createTextInputControl({
      label: '跳转链接',
      tips: '为空时提交仅提示',
    }),
  },
}

export default visualSearch