import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualRichTextProps } from '@visual/ui/components/visual-rich-text/interface'
import { createRichTextInputControl } from '../../utils/visual.control'

const visualRichText: VisualEditorComponent<VisualRichTextProps> = {
  key: 'VisualRichText',
  moduleName: 'basicWidgets',
  componentName: 'VisualRichText',
  label: '富文本',
  previewImage: '/componets/visual-rich-text.svg',
  souceDataType: 'VisualObject',
  props: {
    html: createRichTextInputControl({
      label: 'HTML 内容',
      tips: '使用富文本编辑器编辑，渲染前已做 XSS 清理',
      defaultValue: '<h3>欢迎光临</h3><p>这里是富文本内容，支持<b>加粗</b>、<i>斜体</i>与链接。</p>',
    }),
  },
}

export default visualRichText
