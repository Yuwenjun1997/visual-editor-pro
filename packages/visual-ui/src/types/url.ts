export type VisualUrlMode = 'global-page' | 'app-page' | 'external'

/** A portable navigation target saved in a visual page schema. */
export interface VisualUrl {
  mode: VisualUrlMode
  url: string
}

/** Strings are retained only for schemas saved before URL targets were introduced. */
export type VisualUrlValue = VisualUrl | string
