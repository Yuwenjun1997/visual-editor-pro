<template>
  <visual-box class="visual-poster" :class="_props.class" :styles="_props.styles">
    <div class="visual-poster__card">
      <img v-if="_props.props.bgImage" alt="海报背景" class="visual-poster__bg" :src="_props.props.bgImage" />
      <div v-else class="visual-poster__bg visual-poster__bg--gradient" />
      <div class="visual-poster__scrim" />
      <div class="visual-poster__content">
        <div class="visual-poster__title">{{ title || '邀请好友一起下单' }}</div>
        <div v-if="subtitle" class="visual-poster__subtitle">
          {{ subtitle }}
        </div>
        <img v-if="qrUrl" alt="二维码" :src="qrUrl" :style="qrStyle" class="visual-poster__qr" />
        <div v-if="footerText" class="visual-poster__footer">
          {{ footerText }}
        </div>
        <a
          v-if="_props.props.shareLink"
          :href="btnHref"
          target="_blank"
          rel="noopener noreferrer"
          class="visual-poster__btn"
          @click="handleClick"
        >
          {{ buttonText || '分享给好友' }}
        </a>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import QRCode from 'qrcode'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualPosterProps } from './interface'
import { navigateVisualUrl } from '../../utils/url'
import { useH5Runtime } from '../../hooks/useH5Runtime'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualPosterProps
  class?: string
}

defineOptions({
  name: 'VisualPoster',
})

const _props = defineProps<Props>()
const runtime = useH5Runtime()

const title = computed(() => _props.props.title || '')
const subtitle = computed(() => _props.props.subtitle || '')
const footerText = computed(() => _props.props.footerText || '')

const buttonText = computed(() => _props.props.buttonText || '')

const btnHref = computed(() => {
  return undefined
})

const handleClick = (event: MouseEvent) => {
  event.preventDefault()
  if (_props.props.shareLink) navigateVisualUrl(_props.props.shareLink, runtime)
}

const qrUrl = ref('')

const qrStyle = computed<CSSProperties>(() => {
  const size = `${_props.props.qrSize || 120}px`
  return { width: size, height: size }
})

const render = async () => {
  const content = (_props.props.qrContent || '').trim()
  if (!content) {
    qrUrl.value = ''
    return
  }
  try {
    qrUrl.value = await QRCode.toDataURL(content, {
      margin: 1,
      width: _props.props.qrSize || 120,
      errorCorrectionLevel: 'M',
      color: {
        dark: _props.props.qrFgColor || '#2b2f3a',
        light: _props.props.qrBgColor || '#ffffff',
      },
    })
  } catch {
    qrUrl.value = ''
  }
}

watch(() => [_props.props.qrContent, _props.props.qrSize, _props.props.qrFgColor, _props.props.qrBgColor], render, {
  immediate: true,
})
</script>

<style scoped lang="scss">
.visual-poster {
  .visual-poster__card {
    position: relative;
    overflow: hidden;
    background: var(--v-gradient-primary);
  }

  .visual-poster__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &--gradient {
      background: linear-gradient(160deg, #35407d 0%, #4f6ef7 55%, #7b8cff 100%);
    }
  }

  .visual-poster__scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(15, 18, 40, 0.55));
  }

  .visual-poster__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 32px 20px 24px;
    color: #fff;
    text-align: center;
  }

  .visual-poster__title {
    font-size: 22px;
    font-weight: 800;
    line-height: 1.3;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  }

  .visual-poster__subtitle {
    font-size: 14px;
    opacity: 0.92;
  }

  .visual-poster__qr {
    display: block;
    margin-top: 6px;
    border-radius: 8px;
    padding: 6px;
    background: #fff;
  }

  .visual-poster__footer {
    font-size: 12px;
    opacity: 0.85;
  }

  .visual-poster__btn {
    margin-top: auto;
    padding: 10px 26px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    color: #4f6ef7;
    background: #fff;
    box-shadow: var(--v-shadow-soft);
  }
}
</style>
