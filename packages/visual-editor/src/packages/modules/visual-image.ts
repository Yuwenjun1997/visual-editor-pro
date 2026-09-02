import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualImageProps } from '@visual/ui/components/visual-image/interface'
import { createImageInputControl, createNormalSelectControl, createPxInputControl } from '../../utils/visual.control'

const defaultCover = '/image/cover.svg'

const VisualImage: VisualEditorComponent<VisualImageProps> = {
  key: 'VisualImage',
  moduleName: 'basicWidgets',
  componentName: 'VisualImage',
  label: '图片',
  previewImage: '/componets/visual-image.svg',
  souceDataType: 'VisualObject',
  props: {
    src: createImageInputControl({
      label: '图片地址',
      defaultValue: defaultCover,
    }),
    width: createPxInputControl({ label: '图片宽度' }),
    height: createPxInputControl({ label: '图片高度' }),
    mode: createNormalSelectControl({
      label: '图片裁切',
      options: [
        {
          label: '不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素',
          value: 'scaleToFill',
        },
        {
          label: '保持纵横比缩放图片，使图片的长边能完全显示出来',
          value: 'aspectFit',
        },
        {
          label: '保持纵横比缩放图片，只保证图片的短边能完全显示出来',
          value: 'aspectFill',
        },
        {
          label: '宽度不变，高度自动变化，保持原图宽高比不变',
          value: 'widthFix',
        },
        {
          label: '高度不变，宽度自动变化，保持原图宽高比不变',
          value: 'heightFix',
        },
        {
          label: '不缩放图片，只显示图片的顶部区域',
          value: 'top',
        },
        {
          label: '不缩放图片，只显示图片的底部区域',
          value: 'bottom',
        },
        {
          label: '不缩放图片，只显示图片的中间区域',
          value: 'center',
        },
        {
          label: '不缩放图片，只显示图片的左边区域',
          value: 'left',
        },
        {
          label: '不缩放图片，只显示图片的右边区域',
          value: 'right',
        },
        {
          label: '不缩放图片，只显示图片的左上边区域',
          value: 'top left',
        },
        {
          label: '不缩放图片，只显示图片的右上边区域',
          value: 'top right',
        },
        {
          label: '不缩放图片，只显示图片的左下边区域',
          value: 'bottom left',
        },
        {
          label: '不缩放图片，只显示图片的右下边区域',
          value: 'bottom right',
        },
      ],
    }),
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

export default VisualImage
