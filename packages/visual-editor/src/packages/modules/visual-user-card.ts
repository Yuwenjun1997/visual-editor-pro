import type { VisualEditorComponent } from '../../types/visual-editor'
import { createColorInputControl, createNormalSelectControl, createTextInputControl } from '../../utils/visual.control'
const component: VisualEditorComponent = {
  key: 'VisualUserCard',
  componentName: 'VisualUserCard',
  label: '用户信息卡片',
  moduleName: 'serviceWidgets',
  previewImage: '/componets/visual-user-card.svg',
  props: {
    title: createTextInputControl({ label: '未登录标题', defaultValue: '你还未登录' }),
    buttonText: createTextInputControl({ label: '登录按钮', defaultValue: '去登录' }),
    background: createColorInputControl({ label: '背景', defaultValue: '#ffffff' }),
    layout: createNormalSelectControl({
      label: '布局',
      defaultValue: 'horizontal',
      options: [
        { label: '横向', value: 'horizontal' },
        { label: '纵向', value: 'vertical' },
      ],
    }),
  },
  slots: {},
}
export default component
