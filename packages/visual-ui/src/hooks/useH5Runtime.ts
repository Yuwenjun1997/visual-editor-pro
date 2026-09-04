import { inject, provide, type InjectionKey } from 'vue'

export interface H5NavigateOptions {
  replace?: boolean
  external?: boolean
  appPage?: boolean
}

export interface H5RequestConfig {
  url: string
  method?: string
  params?: Record<string, any>
  body?: any
  headers?: Record<string, string>
}

export interface H5RuntimeContext {
  block?: { _vid: string; key: string; componentName: string }
  interaction?: string
  item?: Record<string, any>
  event?: unknown
}

export interface H5Runtime {
  $navigateTo(url: string, options?: H5NavigateOptions): void | Promise<void>
  $request<T = any>(config: H5RequestConfig): Promise<T>
  $emit(name: string, payload?: Record<string, any>, context?: H5RuntimeContext): void
}

export const H5_RUNTIME_KEY: InjectionKey<H5Runtime> = Symbol('visual-h5-runtime')
export const H5_RUNTIME_CONTEXT_KEY: InjectionKey<H5RuntimeContext> = Symbol('visual-h5-runtime-context')

const fallbackRuntime: H5Runtime = {
  async $navigateTo() {
    if (import.meta.env?.DEV) console.warn('[visual-ui] H5 runtime is not provided; navigation was ignored')
  },
  async $request<T = any>({ url, method = 'GET', params, body, headers }: H5RequestConfig) {
    const requestUrl = new URL(url, typeof window === 'undefined' ? 'http://localhost' : window.location.href)
    if (params && method.toUpperCase() === 'GET') Object.entries(params).forEach(([key, value]) => requestUrl.searchParams.set(key, String(value)))
    const response = await fetch(requestUrl.toString(), {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD' ? undefined : JSON.stringify(body ?? params),
    })
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json() as Promise<T>
  },
  $emit(name) {
    if (import.meta.env?.DEV) console.warn(`[visual-ui] H5 event "${name}" has no handler`)
  },
}

export const provideH5Runtime = (runtime: H5Runtime) => provide(H5_RUNTIME_KEY, runtime)

export const provideH5RuntimeContext = (context: H5RuntimeContext) => provide(H5_RUNTIME_CONTEXT_KEY, context)

export const useH5Runtime = () => inject(H5_RUNTIME_KEY, fallbackRuntime)

export const useH5RuntimeContext = () => inject(H5_RUNTIME_CONTEXT_KEY, {})
