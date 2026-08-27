/**
 * 格式化数字为合法数字
 * @param val
 * @param defaultVal
 * @returns
 */
export const formatNumber = (val: any, defaultVal: number = 0) => {
  if (typeof val === 'number') return val
  if (typeof val === 'string' && val.trim() === '') return defaultVal
  return isNaN(Number(val)) ? defaultVal : Number(val)
}
