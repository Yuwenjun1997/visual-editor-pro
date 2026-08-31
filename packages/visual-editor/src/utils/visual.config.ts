import type {
  BusinessDataProvider,
  ComponentModules,
  VisualEditorComponent,
  VisualPageLoader,
  VisualSaveHandler,
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
    // 宿主注入点(web 在 registryComponent 之后设置;clear() 不清除这些字段)
    onSave: undefined as VisualSaveHandler | undefined,
    savedPageLoader: undefined as VisualPageLoader | undefined,
    businessDataProvider: undefined as BusinessDataProvider | undefined,
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
