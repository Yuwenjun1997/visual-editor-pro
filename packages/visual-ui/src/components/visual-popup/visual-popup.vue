<template>
  <teleport-box :is-design="isDesign">
    <transition name="visual-popup">
      <div
        v-if="show"
        class="visual-popup"
        :class="{ 'visual-popup--design': isDesign }"
        @click.self="isDesign ? undefined : close"
      >
        <div class="visual-popup__card">
          <img v-if="_props.props.bgImage" alt="弹窗背景" class="visual-popup__bg" :src="_props.props.bgImage" />
          <div v-else class="visual-popup__bg visual-popup__bg--gradient" />
          <div class="visual-popup__content">
            <div class="visual-popup__title">{{ title || '活动公告' }}</div>
            <div v-if="description" class="visual-popup__desc">
              {{ description }}
            </div>
            <a v-if="buttonLink" :href="btnHref" class="visual-popup__button" @click="close">
              {{ buttonText || '去看看' }}
            </a>
            <div v-else class="visual-popup__button" @click="close">
              {{ buttonText || '我知道了' }}
            </div>
          </div>
          <button v-if="_props.props.showClose !== false" aria-label="关闭" class="visual-popup__close" @click="close">
            <i class="bi bi-x" />
          </button>
        </div>
      </div>
    </transition>
  </teleport-box>
</template>

<script setup lang="ts">
import TeleportBox from '../../deps/teleport-box/index.vue'
import { getCurrentInstance } from 'vue'
import type { VisualPopupProps } from './interface'

interface Props {
  props: VisualPopupProps
  isDesign?: boolean
}

defineOptions({
  name: 'VisualPopup',
})

const _props = withDefaults(defineProps<Props>(), { isDesign: false })

const isDesign = computed(() => _props.isDesign)

const title = computed(() => _props.props.title || '')
const description = computed(() => _props.props.description || '')
const buttonLink = computed(() => _props.props.buttonLink || '')
const buttonText = computed(() => _props.props.buttonText || '')

const btnHref = computed(() => {
  if (!buttonLink.value) return undefined
  return buttonLink.value.startsWith('http') ? buttonLink.value : `//${buttonLink.value}`
})

const showRef = ref(false)
const show = computed(() => showRef.value)

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
  showRef.value = true
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
}

const close = () => {
  showRef.value = false
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const mode = _props.props.mode || 'delay'
  if (mode === 'manual') {
    showRef.value = true
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
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(15, 18, 40, 0.6);
  backdrop-filter: blur(2px);
}

// 设计态：锚定舞台页容器（浮层块 .visual-block.is-overlay 为 static），蒙层可穿透不拦截下层编辑
.visual-popup--design {
  pointer-events: none;

  .visual-popup__card {
    pointer-events: auto; // 点卡片冒泡到外层 .visual-block 选中该组件
  }
}

.visual-popup__card {
  position: relative;
  width: 300px;
  overflow: hidden;
  border-radius: var(--v-radius-moody);
  background: var(--v-gradient-primary);
  box-shadow: var(--v-shadow-soft);
}

.visual-popup__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  &--gradient {
    background: linear-gradient(160deg, #35407d 0%, #4f6ef7 55%, #7b8cff 100%);
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
  color: #fff;
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
  color: var(--v-primary-1, #4f6ef7);
  background: #fff;
  box-shadow: var(--v-shadow-soft);
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
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
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
