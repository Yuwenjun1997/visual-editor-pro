import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualObjectArrayProps } from '@/uni_modules/visual-components/components/visual-object-array/interface'
import { createSourceDataControl } from '@/utils/visual.control'

const visualObjectArray: VisualEditorComponent<VisualObjectArrayProps> = {
  key: 'VisualObjectArray',
  moduleName: 'dataWidgets',
  componentName: 'VisualObjectArray',
  label: '对象数组',
  previewImage: '/static/image/block.svg',
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
        customJsonDataType: 'VisualObjectArray',
      },
    }),
  },
}

export default visualObjectArray
