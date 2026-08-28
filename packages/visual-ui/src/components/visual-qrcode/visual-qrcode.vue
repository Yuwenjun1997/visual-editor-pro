<template>
  <visual-box class="visual-qrcode" :styles="_props.styles" :class="_props.class">
    <div class="visual-qrcode__inner">
      <img
        v-if="qrUrl"
        class="visual-qrcode__img"
        :src="qrUrl"
        :style="imgStyle"
        alt="二维码"
      />
      <div v-else class="visual-qrcode__empty">请输入二维码内容</div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import QRCode from 'qrcode'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualQRCodeProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualQRCodeProps
  class?: string
}

defineOptions({
  name: 'VisualQRCode',
})

const _props = defineProps<Props>()

const qrUrl = ref('')

const imgStyle = computed<CSSProperties>(() => {
  const size = `${_props.props.size || 200}px`
  return { width: size, height: size }
})

const render = async () => {
  const content = (_props.props.content || '').trim()
  if (!content) {
    qrUrl.value = ''
    return
  }
  try {
    qrUrl.value = await QRCode.toDataURL(content, {
      margin: _props.props.margin ?? 2,
      width: _props.props.size || 200,
      errorCorrectionLevel: _props.props.level || 'M',
      color: {
        dark: _props.props.fgColor || '#000000',
        light: _props.props.bgColor || '#ffffff',
      },
    })
  } catch {
    qrUrl.value = ''
  }
}

watch(
  () => [
    _props.props.content,
    _props.props.size,
    _props.props.margin,
    _props.props.level,
    _props.props.fgColor,
    _props.props.bgColor,
  ],
  render,
  { immediate: true }
)
</script>

<style scoped lang="scss">
.visual-qrcode {
  .visual-qrcode__inner {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .visual-qrcode__img {
    display: block;
    border-radius: 6px;
  }

  .visual-qrcode__empty {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    font-size: 13px;
    color: var(--v-text-4);
    border: 1px dashed var(--v-gray-2);
    border-radius: var(--v-radius-moody-sm);
    box-sizing: border-box;
  }
}
</style>