import type { CSSProperties } from 'vue'
import home from './templates/home.json'
import sales from './templates/sales.json'
import content from './templates/content.json'
import form from './templates/form.json'
import store from './templates/store.json'
import member from './templates/member.json'

export interface VisualTemplate {
  id: string
  name: string
  description: string
  icon: string
  /** 模板卡片缩略图用的渐变背景 */
  accent?: string
  theme?: {
    themeName?: string
    title?: string
    globalStyle?: CSSProperties
  }
  blocks: Array<Record<string, any>>
}

export const visualTemplates: VisualTemplate[] = [home, sales, content, form, store, member]
