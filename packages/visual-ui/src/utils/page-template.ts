import type { VisualRuntimeBlock } from '../types'
const definitions: Record<string, [string, string, string]> = {
  profile: ['VisualUserCard', '用户信息卡片', 'serviceWidgets'],
  'product-detail': ['VisualProductDetail', '商品详情', 'commerceWidgets'],
  'article-detail': ['VisualArticleDetail', '文章详情', 'imageTextWidgets'],
}
export const defaultPageBlocks = (type: string): VisualRuntimeBlock[] => {
  const definition = definitions[type]
  if (!definition) return []
  const [name, label, moduleName] = definition
  return [
    {
      _vid: 'default-' + type,
      key: name,
      componentName: name,
      label,
      moduleName,
      props: {},
      styles: {},
      ...(type === 'profile'
        ? {}
        : { slots: { top: { name: '顶部内容', blocks: [] }, bottom: { name: '底部内容', blocks: [] } } }),
    },
  ]
}
export const upgradeTemplateBlocks = (
  blocks: VisualRuntimeBlock[],
  type: string,
  title: string,
): VisualRuntimeBlock[] => {
  if (!definitions[type] || blocks.length !== 1) return blocks
  const block = blocks[0]
  if (!block) return blocks
  const props = block.props || {}
  const styles = block.styles || {}
  const originalTitle = type === 'profile' ? '个人中心' : type === 'product-detail' ? '商品详情' : '文章详情'
  if (
    block.key !== 'VisualText' ||
    block.componentName !== 'VisualText' ||
    block.label !== '文本' ||
    block.moduleName !== 'basicWidgets'
  )
    return blocks
  if (
    ![title, originalTitle].includes(props.text) ||
    props.fontSize !== 'lg' ||
    props.textAlign !== 'center' ||
    Object.keys(props).length !== 3
  )
    return blocks
  if (styles.padding !== '32px 16px' || Object.keys(styles).length !== 1 || block.slots || block.data || block.listData)
    return blocks
  return defaultPageBlocks(type)
}
