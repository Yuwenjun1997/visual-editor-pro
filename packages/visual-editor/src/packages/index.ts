import type { VisualEditorComponent } from '../types/visual-editor'

const modules = import.meta.glob('./**/*.ts', { eager: true })

const components: Record<string, VisualEditorComponent> = {}

Object.entries(modules).forEach(([key, module]) => {
  const name = key.replace(/\.\/(.*)\.(tsx|vue)/, '$1')
  components[name] = (module as any)?.default || module
})

export default components
