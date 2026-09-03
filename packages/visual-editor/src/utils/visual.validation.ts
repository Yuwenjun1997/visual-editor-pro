const PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const isValidPageSlug = (value: string): boolean =>
  value.length > 0 && value.length <= 80 && PAGE_SLUG_PATTERN.test(value)

export const normalizePageSlug = (value: string): string => value.trim().toLowerCase()
