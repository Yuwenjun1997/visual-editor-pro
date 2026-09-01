import VisualSearch from './visual-search.vue'

export default VisualSearch

declare module 'vue' {
  export interface GlobalComponents {
    VisualSearch: typeof VisualSearch
  }
}
