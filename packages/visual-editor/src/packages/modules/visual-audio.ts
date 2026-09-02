import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualAudioProps } from '@visual/ui/components/visual-audio/interface'
import { createPxInputControl, createSwitchControl, createTextInputControl } from '../../utils/visual.control'

const visualAudio: VisualEditorComponent<VisualAudioProps> = {
  key: 'VisualAudio',
  moduleName: 'mediaWidgets',
  componentName: 'VisualAudio',
  label: '音频播放',
  previewImage: '/componets/visual-audio.svg',
  props: {
    src: createTextInputControl({ label: '音频地址', tips: 'mp3 等音频资源地址' }),
    title: createTextInputControl({ label: '标题' }),
    autoplay: createSwitchControl({ label: '自动播放' }),
    loop: createSwitchControl({ label: '循环播放', defaultValue: true }),
    controls: createSwitchControl({ label: '显示控制条', defaultValue: true }),
    width: createTextInputControl({
      label: '宽度',
      tips: '如 100% 或 300px',
      defaultValue: '100%',
    }),
    round: createPxInputControl({ label: '圆角大小' }),
  },
}

export default visualAudio
