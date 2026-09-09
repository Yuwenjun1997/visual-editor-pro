import type { ComputedRef, InjectionKey } from 'vue'

export const APP_TEXT_COLOR_KEY: InjectionKey<ComputedRef<string | undefined>> = Symbol('app-text-color')
