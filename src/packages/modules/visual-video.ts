import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualVideoProps } from '@/uni_modules/visual-components/components/visual-video/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'

const defaultVideoUrl = '/media/flower.mp4'

const VisualVideo: VisualEditorComponent<VisualVideoProps> = {
  key: 'VisualVideo',
  moduleName: 'basicWidgets',
  componentName: 'VisualVideo',
  label: '视频播放',
  previewImage: '/image/block.svg',
  props: {
    title: createTextInputControl({ label: '标题', defaultValue: '' }),
    src: createImageInputControl({
      label: '视频地址',
      defaultValue: defaultVideoUrl,
    }),
    autoplay: createSwitchControl({ label: '自动播放', defaultValue: false }),
    loop: createSwitchControl({ label: '循环播放', defaultValue: false }),
    muted: createSwitchControl({ label: '静音播放', defaultValue: false }),
    controls: createSwitchControl({ label: '显示控件', defaultValue: true }),
    showFullscreenBtn: createSwitchControl({
      label: '显示全屏按钮',
      defaultValue: true,
    }),
    showPlayBtn: createSwitchControl({
      label: '显示播放按钮',
      defaultValue: true,
    }),
    showProgress: createSwitchControl({
      label: '显示进度条',
      defaultValue: true,
    }),
    objectFit: createNormalSelectControl({
      label: '填充模式',
      options: [
        { label: '包含', value: 'contain' },
        { label: '覆盖', value: 'cover' },
        { label: '填充', value: 'fill' },
      ],
    }),
    width: createPxInputControl({ label: '视频宽度' }),
    height: createPxInputControl({ label: '视频高度' }),
    round: createNormalSelectControl({
      label: '圆角',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
    }),
    align: createNormalSelectControl({
      label: '对齐方式',
      options: [
        { label: '左对齐', value: 'flex-start' },
        { label: '居中对齐', value: 'center' },
        { label: '右对齐', value: 'flex-end' },
      ],
    }),
  },
}

export default VisualVideo
