import { cloneDeep, get as getObjectValue } from 'lodash'
import type { VisualHttpField, VisualSourceOptions } from '../types'
import { useH5Runtime } from './useH5Runtime'

interface VisualResuestCustomOptions {
  pageNum: number
  pageSize: number
}

export const useVisualRequest = (options: VisualSourceOptions) => {
  const runtime = useH5Runtime()
  const transformFieldsToObject = (fileds: VisualHttpField[] = []) => {
    return fileds.reduce((prev, current) => ({ ...prev, [current.key]: current.value }), {} as Record<string, any>)
  }

  const transformResultItem = (item: any, keyMap: Record<string, any>) => {
    if (typeof item !== 'object') return item
    const cloneItem = cloneDeep(item)
    Object.keys(keyMap).forEach((key) => {
      cloneItem[key] = getObjectValue(cloneItem, keyMap[key], '')
    })
    return cloneItem
  }

  const transformResult = (data: any) => {
    const keyMap = transformFieldsToObject(options.httpResponseTransforms)
    if (Array.isArray(data)) {
      return data.map((item) => transformResultItem(item, keyMap))
    } else {
      return transformResultItem(data, keyMap)
    }
  }

  const request = (customOption?: VisualResuestCustomOptions) => {
    if (!options.httpRequest) return Promise.reject(new Error('No HTTP request URL'))

    const url = options.httpRequest
    const method = (options.httpMethod || 'GET').toUpperCase()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...transformFieldsToObject(options.httpRequestHeaders),
    }
    const body = {
      ...transformFieldsToObject(options.httpRequestParams),
      ...customOption,
    }

    return runtime
      .$request({
        url,
        method,
        headers,
        params: method === 'GET' || method === 'HEAD' ? body : undefined,
        body: method === 'GET' || method === 'HEAD' ? undefined : body,
      })
      .then((data) => transformResult(data))
  }

  return {
    request,
  }
}
