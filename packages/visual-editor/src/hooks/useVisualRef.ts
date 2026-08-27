const visualRefs: Record<string, any> = {}

export const useVisualRef = () => {
  const registerRef = (el: any, _vid: string) => el && (visualRefs[_vid] = el)

  const getRef = <T>(vid: string) => {
    if (visualRefs[vid]) return visualRefs[vid] as T
  }

  return { registerRef, getRef }
}
