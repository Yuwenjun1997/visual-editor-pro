import type { ThemeColors } from '../types/theme'

/**
 * 使颜色变暗的函数
 * @param {string} color - 要调整的颜色，以#RRGGBB格式
 * @param {number} percent - 调整的百分比
 * @returns {string} - 变暗后的颜色，以#RRGGBB格式
 */
export const darken = (color: string, percent: number): string => {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = ((num >> 8) & 0x00ff) - amt,
    B = (num & 0x0000ff) - amt

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)
    .toUpperCase()}`
}

/**
 * 使颜色变浅的函数
 * @param {string} color - 要调整的颜色，以#RRGGBB格式
 * @param {number} percent - 调整的百分比
 * @returns {string} - 变浅后的颜色，以#RRGGBB格式
 */
export const lighten = (color: string, percent: number): string => {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)
    .toUpperCase()}`
}

/**
 * 处理颜色的方法，接受颜色和透明度，返回新的颜色
 * @param {string} color - 颜色，以#RRGGBB格式
 * @param {number} opacity - 透明度，范围从0到1
 * @returns {string} - 新的颜色，以rgba格式
 */
export const processColor = (color: string, opacity: number): string => {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    throw new Error('Invalid color format. Use #RRGGBB.')
  }
  let r = 0,
    g = 0,
    b = 0
  if (color.length === 4) {
    r = parseInt(color[1]! + color[1]!, 16)
    g = parseInt(color[2]! + color[2]!, 16)
    b = parseInt(color[3]! + color[3]!, 16)
  } else if (color.length === 7) {
    r = parseInt(color[1]! + color[2]!, 16)
    g = parseInt(color[3]! + color[4]!, 16)
    b = parseInt(color[5]! + color[6]!, 16)
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * 将两个颜色混合生成新的颜色
 * @param color1
 * @param color2
 * @param percentage
 * @returns
 */
export const mixColors = (color1: string, color2: string, percentage: number) => {
  // 将十六进制颜色转换为RGB
  function hexToRgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
  }

  // 将RGB颜色转换为十六进制
  function rgbToHex(r: number, g: number, b: number) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  }

  // 混合颜色
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const p = percentage / 100

  const mixedR = Math.round(rgb1[0] * (1 - p) + rgb2[0] * p)
  const mixedG = Math.round(rgb1[1] * (1 - p) + rgb2[1] * p)
  const mixedB = Math.round(rgb1[2] * (1 - p) + rgb2[2] * p)

  return rgbToHex(mixedR, mixedG, mixedB)
}

/**
 * 生成主题颜色
 * @param {object} colors 主题基本颜色键值对
 * @param {boolean} isDark 生成暗色主题
 */
export const generateTheme = (colors: ThemeColors, isDark: boolean = false): Record<string, any> => {
  const result: Record<string, any> = {}
  Object.entries(colors).forEach(([key, value]) => {
    for (let i = 0; i < 6; i++) {
      if (!['white', 'black', 'text'].includes(key)) {
        const colorKey = `${key}-${i + 1}`
        result[colorKey] = isDark ? mixColors(value, '#000000', i * 16) : mixColors(value, '#ffffff', i * 16)
      } else if (key === 'text') {
        const colorKey = `${key}-${i + 1}`
        result[colorKey] = mixColors(value, '#ffffff', i * 19.4)
      } else {
        result[key] = value
      }
    }
    for (let i = 0; i < 6; i++) {
      const colorKey = `${key}-opacity-${i + 1}`
      result[colorKey] = processColor(value, 0.1 * (6 - i))
    }
  })
  return result
}
