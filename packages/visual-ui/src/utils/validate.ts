export const isColorCode = (val: any) => {
  if (typeof val !== 'string') return false
  if (val.startsWith('rgb')) return true
  return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(val)
}

// 以http:// 或 https:// 开头 或者 以图片文件后缀名结尾的url
export const isPictureUrl = (val: any) => {
  if (typeof val !== 'string') return false
  return /^(http|https):\/\/[^\s]+$/.test(val) || /\.(png|jpg|jpeg|gif|svg)$/.test(val)
}

/**
 * 判断是否是数字(包含正负和小数)
 * @param val
 * @returns
 */
export const isNumber = (val: any) => {
  if (typeof val === 'string') {
    return /^\d+$/.test(val) || /^\-?\d+$/.test(val) || /^\-?\d+.\d+$/.test(val)
  }
  return typeof val === 'number'
}
