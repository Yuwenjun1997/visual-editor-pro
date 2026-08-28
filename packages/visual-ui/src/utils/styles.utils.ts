import type { CSSProperties } from 'vue'

type CSSPropertiesKeys = keyof CSSProperties

export const visualBoxStyles: CSSPropertiesKeys[] = [
  '--shadow-offset-x',
  '--shadow-offset-y',
  '--shadow-blur-radius',
  '--shadow-spread-radius',
  '--shadow-color',
  '--border-width',
  '--border-color',
  '--border-style',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'opacity',
  'boxShadow',
]

export const visualBoxInnerStyles: CSSPropertiesKeys[] = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'backgroundColor',
  'backgroundImage',
  'backgroundSize',
  'backgroundRepeat',
  'backgroundPosition',
  'border',
]

export const filterStylesByKeys = (
  keys: CSSPropertiesKeys[],
  styles: CSSProperties
): CSSProperties =>
  keys.reduce((prev, key) => ({ [key]: styles[key], ...prev }), {})

export const getBoxStyles = (styles: CSSProperties) =>
  filterStylesByKeys(visualBoxStyles, styles)

export const getBoxInnerStyles = (styles: CSSProperties) =>
  filterStylesByKeys(visualBoxInnerStyles, styles)

// 获取spacing
export const cssSpacingVar = (size?: string) => {
  return size ? `var(--v-spacing-${size})` : ''
}

// 获取字体大小
export const cssTextSizeVar = (size?: string) => {
  return size ? `var(--v-text-${size})` : ''
}

// 圆角大小
export const cssRadiusVar = (size?: string) => {
  return size ? `var(--v-radius-${size})` : ''
}
