<template>
  <teleport to="body">
    <transition name="visual-popup">
      <div v-if="show" ref="popupRef" role="dialog" aria-modal="true" class="visual-popup" @click.self="close">
        <div class="visual-popup__card">
          <img v-if="_props.props.bgImage" alt="弹窗背景" class="visual-popup__bg" :src="_props.props.bgImage" />
          <div v-else class="visual-popup__bg visual-popup__bg--gradient" />
          <div class="visual-popup__content">
            <div class="visual-popup__title">{{ title || '活动公告' }}</div>
            <div v-if="description" class="visual-popup__desc">
              {{ description }}
            </div>
            <a
              v-if="buttonLink"
              :href="btnHref"
              target="_blank"
              rel="noopener noreferrer"
              class="visual-popup__button"
              @click="handleLink"
            >
              {{ buttonText || '去看看' }}
            </a>
            <div v-else class="visual-popup__button" @click="close">
              {{ buttonText || '我知道了' }}
            </div>
          </div>
          <button
            v-if="_props.props.showClose !== false"
            ref="closeButton"
            type="button"
            aria-label="关闭"
            class="visual-popup__close"
            @click="close"
          >
            <i class="bi bi-x" />
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick } from 'vue'
import type { VisualPopupProps } from './interface'
import { navigateVisualUrl } from '../../utils/url'
import { useH5Runtime } from '../../hooks/useH5Runtime'

interface Props {
  props: VisualPopupProps
}

defineOptions({
  name: 'VisualPopup',
})

const _props = defineProps<Props>()
const runtime = useH5Runtime()

const title = computed(() => _props.props.title || '')
const description = computed(() => _props.props.description || '')
const buttonLink = computed(() => _props.props.buttonLink || '')
const buttonText = computed(() => _props.props.buttonText || '')

const btnHref = computed(() => undefined)

const showRef = ref(false)
const show = computed(() => showRef.value)
const popupRef = ref<HTMLDivElement>()
const closeButton = ref<HTMLButtonElement>()
let previousActiveElement: HTMLElement | null = null

// 实例级命名空间，避免同一页面多个弹窗的触发标记互相串扰
const KEY_PREFIX = 'visualPopup'
const instanceId = `visual-popup-${getCurrentInstance()?.uid ?? 0}`
const storageKey = `${KEY_PREFIX}:${instanceId}`

const shouldShow = () => {
  const frequency = _props.props.frequency || 'session'
  if (frequency === 'every') return true
  const store = frequency === 'once' ? localStorage : sessionStorage
  if (store.getItem(storageKey)) return false
  store.setItem(storageKey, '1')
  return true
}

const doOpen = () => {
  previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  showRef.value = true
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
  nextTick(() => closeButton.value?.focus())
}

const close = () => {
  const restoreTarget = previousActiveElement
  previousActiveElement = null
  if (restoreTarget?.isConnected) restoreTarget.focus()
  else if (popupRef.value?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur()
  showRef.value = false
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
}

const handleLink = (event: MouseEvent) => {
  event.preventDefault()
  navigateVisualUrl(_props.props.buttonLink, runtime)
  close()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const mode = _props.props.mode || 'delay'
  if (mode === 'manual') {
    doOpen()
    return
  }
  const openPopup = () => {
    if (shouldShow()) doOpen()
  }
  if (mode === 'delay') {
    const seconds = Number(_props.props.delaySeconds) || 0
    timer = setTimeout(openPopup, seconds * 1000)
  } else {
    // firstVisit：进入页面即判断
    openPopup()
  }
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped lang="scss">
.visual-popup {
  --visual-popup-radius-moody: var(--v-radius-moody, 12px);
  --visual-popup-gradient-primary: var(--v-gradient-primary, linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%));
  --visual-popup-shadow-soft: var(--v-shadow-soft, 0 8px 24px -12px rgba(79, 110, 247, 0.5));
  --visual-popup-primary-1: var(--v-primary-color, #4f6ef7);
  --visual-popup-overlay: var(--v-black-opacity-4, rgba(15, 18, 40, 0.6));
  --visual-popup-white: var(--v-white, #ffffff);
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: var(--visual-popup-overlay);
  backdrop-filter: blur(2px);
}

.visual-popup__card {
  position: relative;
  width: 300px;
  overflow: hidden;
  border-radius: var(--visual-popup-radius-moody);
  background: var(--visual-popup-gradient-primary);
  box-shadow: var(--visual-popup-shadow-soft);
}

.visual-popup__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  &--gradient {
    background: var(--visual-popup-gradient-primary);
  }
}

.visual-popup__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 44px 24px 26px;
  color: var(--visual-popup-white);
  text-align: center;
}

.visual-popup__title {
  font-size: 20px;
  font-weight: 800;
}

.visual-popup__desc {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.92;
}

.visual-popup__button {
  margin-top: 8px;
  padding: 10px 30px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  color: var(--visual-popup-primary-1, #4f6ef7);
  background: var(--visual-popup-white);
  box-shadow: var(--visual-popup-shadow-soft);
  cursor: pointer;
  user-select: none;
}

.visual-popup__close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: color-mix(in srgb, var(--visual-popup-white) 25%, transparent);
  color: var(--visual-popup-white);
  font-size: 18px;
  cursor: pointer;

  i {
    display: block;
    line-height: 1;
  }
}

.visual-popup-enter-active,
.visual-popup-leave-active {
  transition: opacity 0.25s;
}

.visual-popup-enter-active .visual-popup__card,
.visual-popup-leave-active .visual-popup__card {
  transition: transform 0.25s;
}

.visual-popup-enter-from,
.visual-popup-leave-to {
  opacity: 0;
}

.visual-popup-enter-from .visual-popup__card,
.visual-popup-leave-to .visual-popup__card {
  transform: scale(0.92);
}
</style>
