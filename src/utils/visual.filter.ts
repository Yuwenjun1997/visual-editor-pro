import type { CSSProperties } from 'vue'

const filterPropsMap: Record<string, string[]> = {
  VisualFlex: ['flexDirection', 'justifyContent', 'alignItems', 'gap'],
}

const filterStylesMap: Record<string, string[]> = {
  VisualFlex: ['flexDirection', 'justifyContent', 'alignItems', 'gap'],
}

export const filterProps = (key?: string, props: Record<string, any> = {}) => {
  if (!key) return props
  if (!Object.prototype.hasOwnProperty.call(filterPropsMap, key)) return props
  return Object.entries(props).reduce((result, [prop, value]) => {
    if (!filterPropsMap[key].includes(prop)) result[prop] = value
    return result
  }, {} as Record<string, any>)
}

export const filterStyles = (
  key?: string,
  styles: CSSProperties = {}
): CSSProperties => {
  if (!key) return styles
  if (!Object.prototype.hasOwnProperty.call(filterStylesMap, key)) return styles
  return Object.entries(styles).reduce((result, [prop, value]) => {
    if (!filterStylesMap[key].includes(prop)) result[prop] = value
    return result
  }, {} as Record<string, any>)
}

export const collectionProps = (
  key?: string,
  props: Record<string, any> = {}
) => {
  if (!key) return {}
  if (!Object.prototype.hasOwnProperty.call(filterPropsMap, key)) return {}
  return Object.entries(props).reduce((result, [prop, value]) => {
    if (filterPropsMap[key].includes(prop)) result[prop] = value
    return result
  }, {} as Record<string, any>)
}

export const collectionStyles = (
  key?: string,
  styles: CSSProperties = {}
): CSSProperties => {
  if (!key) return {}
  if (!Object.prototype.hasOwnProperty.call(filterStylesMap, key)) return {}
  return Object.entries(styles).reduce((result, [prop, value]) => {
    if (filterStylesMap[key].includes(prop)) result[prop] = value
    return result
  }, {} as Record<string, any>)
}
