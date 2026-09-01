import VisualAudio from './visual-audio.vue'

export default VisualAudio

declare module 'vue' {
  export interface GlobalComponents {
    VisualAudio: typeof VisualAudio
  }
}
