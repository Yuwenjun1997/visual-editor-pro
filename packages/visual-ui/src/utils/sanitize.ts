import DOMPurify from 'dompurify'

const allowedTags = [
  'a',
  'audio',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'img',
  'input',
  'li',
  'mark',
  'ol',
  'p',
  'pre',
  's',
  'source',
  'span',
  'strong',
  'u',
  'ul',
  'video',
]
const allowedAttributes = [
  'alt',
  'background-color',
  'checked',
  'class',
  'color',
  'controls',
  'data-checked',
  'data-type',
  'disabled',
  'height',
  'href',
  'poster',
  'rel',
  'src',
  'style',
  'target',
  'title',
  'type',
  'width',
]
const unsafeProtocol = /(?:href|src|poster)\s*=\s*(["'])?\s*(?:javascript|data|vbscript):/gi

const sanitizeWithoutDom = (html: string) =>
  html
    .replace(/<\/?(?:script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/<div[^>]*data-media-upload[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[^"']*\1/gi, '')
    .replace(unsafeProtocol, '')

// 浏览器使用 DOMPurify，避免把仅 Node 可用的 sanitize-html 及其 fs/path 依赖打入客户端。
export const sanitizeRichText = (html?: string): string => {
  if (!html) return ''
  const source = html.replace(/<div[^>]*data-media-upload[^>]*>[\s\S]*?<\/div>/gi, '')
  if (!DOMPurify.isSupported) return sanitizeWithoutDom(source)
  return DOMPurify.sanitize(source, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):)/i,
  })
}
