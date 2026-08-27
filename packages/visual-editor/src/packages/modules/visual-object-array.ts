import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualObjectArrayProps } from '@visual/ui/components/visual-object-array/interface'
import { createSourceDataControl } from '../../utils/visual.control'

const visualObjectArray: VisualEditorComponent<VisualObjectArrayProps> = {
  key: 'VisualObjectArray',
  moduleName: 'dataWidgets',
  componentName: 'VisualObjectArray',
  label: '对象数组',
  previewImage: '/componets/visual-object-array.svg',
  slots: {
    default: {
      name: '组件',
      size: 1,
      blocks: [],
    },
  },
  props: {
    options: createSourceDataControl({
      label: '数据来源',
      defaultValue: {
        dataSource: 'custom',
        httpMethod: 'GET',
        customDataType: 'VisualObjectArray',
      },
    }),
  },
}

export default visualObjectArray
