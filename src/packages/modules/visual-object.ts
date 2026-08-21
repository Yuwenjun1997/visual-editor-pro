import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualObjectProps } from '#visual-ui/components/visual-object/interface'
import { createSourceDataControl } from '@/utils/visual.control'

const visualObject: VisualEditorComponent<VisualObjectProps> = {
  key: 'VisualObject',
  moduleName: 'dataWidgets',
  componentName: 'VisualObject',
  label: '对象',
  previewImage: '/image/block.svg',
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
        customDataType: 'VisualObject',
      },
    }),
  },
}

export default visualObject
