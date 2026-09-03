import './styles/index.scss'

export { default as EditorLayout } from './layout/DefaultLayout.vue'
export { default as EditorStage } from './views/index/index.vue'
export { default as DevScenario } from './views/dev/index.vue'

export { setupVisual } from './plugins/visual-components'
export {
  DEFAULT_VISUAL_THEME,
  VISUAL_THEME_PRESETS,
  resolveVisualThemeName,
  visualThemeConfig,
  type VisualThemeName,
} from './configs/visual-theme'
export { registryComponent, visualConfig } from './utils/visual.registry'
export { default as visualComponents } from './packages'

export { useViusalStore } from './store/useVisual'

export { useBlocks } from './hooks/useBlocks'
export { initializeHistory, resetHistory, suspendHistory, useHistory } from './hooks/useHistory'
export { useLayout } from './hooks/useLayout'
export { usePageConfig, type PageConfig } from './hooks/usePageConfig'
export { useReload } from './hooks/useReload'
export { useSchema } from './hooks/useSchema'
export { getSchema, getSchemas } from './schemas'
export { useSourceDataEditor } from './hooks/useSourceDataEditor'
export { useViewJson } from './hooks/useViewJson'
export { useVisualRef } from './hooks/useVisualRef'
export { isValidPageSlug, normalizePageSlug } from './utils/visual.validation'

export * from './types/visual-editor'
