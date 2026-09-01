import components from '../packages'
import { createVisualBlockConfig } from './visual.config'

export const visualConfig = createVisualBlockConfig()

export const registryComponent = () => {
  visualConfig.clear()
  Object.values(components).forEach((component) => {
    visualConfig.registry(component.moduleName, component.key, component)
  })
  console.log(
    `%c成功加载组件数量:${Object.keys(visualConfig.componentMap).length}`,
    'color:#409EFF;background-color:#ecf5ff;padding:0 10px;line-height:2;margin-bottom:4px;',
  )

  console.log(visualConfig)
}
