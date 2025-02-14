import { cloneDeep, get as getObjectValue } from 'lodash'
import type { VisualHttpField, VisualSourceOptions } from '../types'

interface VisualResuestCustomOptions {
  pageNum: number
  pageSize: number
}

export const useVisualRequest = (options: VisualSourceOptions) => {
  // 将字段数组转换为对象
  const transformFieldsToObject = (fileds: VisualHttpField[] = []) => {
    return fileds.reduce(
      (prev, current) => ({ ...prev, [current.key]: current.value }),
      {} as Record<string, any>
    )
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
    return new Promise((resolve, reject) => {
      if (!options.httpRequest) return
      uni.request({
        url: options.httpRequest,
        method: options.httpMethod,
        dataType: 'json',
        data: {
          ...transformFieldsToObject(options.httpRequestParams),
          ...customOption,
        },
        header: {
          ...transformFieldsToObject(options.httpRequestHeaders),
        },
        success: (result) => resolve(transformResult(result.data)),
        fail: reject,
      })
    })
  }

  return {
    request,
  }
}
