import type { CSSProperties } from 'vue'

/** 公开运行时使用的页面 JSON。它刻意不依赖 @visual/editor。 */
export interface VisualRuntimeBlock {
  _vid: string
  key: string
  componentName: string
  props?: Record<string, any>
  styles?: CSSProperties
  slots?: Record<string, { blocks: VisualRuntimeBlock[] }>
  listData?: Array<Record<string, any>>
  data?: Record<string, any>
}
