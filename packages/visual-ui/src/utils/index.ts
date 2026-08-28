export * from './cn'
export * from './format'
export * from './sanitize'

export type JsonObject = Record<string, any>
export type JsonObjectArray = Array<JsonObject>

export const formatJsonToObject = (jsonText?: string): JsonObject => {
  try {
    return JSON.parse(jsonText || JSON.stringify({}))
  } catch (error) {
    console.warn('jsonText format error:', error)
    return {}
  }
}

export const formatJsonToObjectArray = (jsonText?: string): JsonObjectArray => {
  try {
    return JSON.parse(jsonText || JSON.stringify([]))
  } catch (error) {
    console.warn('jsonText format error:', error)
    return []
  }
}

export const getErrorMsg = (error: any) => {
  return error.message || error.msg || error.errMsg || JSON.stringify(error)
}
