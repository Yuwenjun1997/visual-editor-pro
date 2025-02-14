import type { VisualSchema, VisualSchemaItem } from '@/types/visual-editor'

export interface SchemaCollector {
  [propName: string]: Set<string>
}

const modules = import.meta.glob('./**/*.ts', { eager: true })

const schemaMap: Record<string, VisualSchema> = {}

Object.entries(modules).forEach(([key, module]) => {
  const result: VisualSchema = (module as any)?.default
  schemaMap[result.visualKey] = (module as any)?.default
})

export default schemaMap

export const generateSchemas = (visualKeys: string[]): VisualSchemaItem[] => {
  const schemaCollector: SchemaCollector = {}
  visualKeys.forEach((key) => {
    if (!schemaMap[key]) return
    schemaMap[key].schemas.forEach(({ label, propName }) => {
      if (!schemaCollector[propName]) schemaCollector[propName] = new Set()
      schemaCollector[propName].add(label)
    })
  })
  return Object.entries(schemaCollector).map(([propName, labels]) => ({
    label: Array.from(labels).join(','),
    propName,
  }))
}
