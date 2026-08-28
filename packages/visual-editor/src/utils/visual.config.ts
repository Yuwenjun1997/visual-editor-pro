import type {
  ComponentModules,
  VisualEditorComponent,
} from '../types/visual-editor'

export function createVisualBlockConfig() {
  const componentModules: ComponentModules = {
    basicWidgets: [],
    layoutWidgets: [],
    imageTextWidgets: [],
    mediaWidgets: [],
    commerceWidgets: [],
    serviceWidgets: [],
    dataWidgets: [],
  }
  const componentMap: Record<string, VisualEditorComponent> = {}
  return {
    componentModules,
    componentMap,
    clear(): void {
      componentModules.basicWidgets.length = 0
      componentModules.layoutWidgets.length = 0
      componentModules.imageTextWidgets.length = 0
      componentModules.mediaWidgets.length = 0
      componentModules.commerceWidgets.length = 0
      componentModules.serviceWidgets.length = 0
      componentModules.dataWidgets.length = 0
    },
    registry: (
      moduleName: keyof ComponentModules,
      key: string,
      component: VisualEditorComponent
    ) => {
      const comp = { ...component, key, moduleName }
      componentModules[moduleName].push(comp)
      componentMap[key] = comp
    },
  }
}
