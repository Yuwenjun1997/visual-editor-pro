import type { VisualEditorComponent } from '../../types/visual-editor'
import { createNormalSelectControl, createTextInputControl } from '../../utils/visual.control'
const component: VisualEditorComponent = {
  key: 'VisualAuthGuard',
  componentName: 'VisualAuthGuard',
  label: '权限控制',
  moduleName: 'dataWidgets',
  previewImage: '/componets/visual-auth-guard.svg',
  props: {
    mode: createNormalSelectControl({
      label: '条件组合',
      defaultValue: 'all',
      options: [
        { label: '全部满足', value: 'all' },
        { label: '任一满足', value: 'any' },
      ],
    }),
    login: createNormalSelectControl({
      label: '登录策略',
      defaultValue: 'authenticated',
      options: [
        { label: '已登录', value: 'authenticated' },
        { label: '未登录', value: 'anonymous' },
        { label: '不限制', value: 'any' },
      ],
    }),
    roles: createTextInputControl({ label: '允许角色（逗号分隔）', defaultValue: '' }),
  },
  slots: { default: { name: '受控内容', blocks: [] }, fallback: { name: '无权限内容', blocks: [] } },
}
export default component
