export interface FormatPriceOptions {
  currency?: string
  digits?: number
  keepZero?: boolean
}

// 价格格式化：默认保留两位小数、去除末尾多余的 0（99.50 -> ¥99.5、99.00 -> ¥99）
export const formatPrice = (
  value?: number | string,
  opts: FormatPriceOptions = {}
): string => {
  const { currency = '¥', digits = 2, keepZero = false } = opts
  const num = Number(value)
  if (!Number.isFinite(num)) return `${currency}0`
  let text = num.toFixed(digits)
  if (!keepZero && digits > 0) {
    text = text.replace(/\.?0+$/, '')
  }
  return `${currency}${text}`
}