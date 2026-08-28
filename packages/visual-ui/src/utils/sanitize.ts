import DOMPurify from 'dompurify'

// 富文本渲染前的 XSS 清理：剥离 script、on*、javascript: 等危险内容
export const sanitizeRichText = (html?: string): string => {
  if (!html) return ''
  return DOMPurify.sanitize(html)
}