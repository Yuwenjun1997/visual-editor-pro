<template>
  <teleport to="body">
    <transition name="visual-float">
      <a
        v-if="visible"
        class="visual-float-action"
        :class="'visual-float-action--' + (position || 'right')"
        :style="actionStyle"
        :href="href"
        :aria-label="mode"
        @click="handleClick"
      >
        <visual-icon :icon="icon || defaultIcon" :color="textColor" size="22px" />
      </a>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualIcon from '../visual-icon/visual-icon.vue'
import { toast } from '../../utils/toast'
import type { VisualFloatActionProps } from './interface'

interface Props {
  props: VisualFloatActionProps
}

defineOptions({
  name: 'VisualFloatAction',
})

const _props = defineProps<Props>()

const mode = computed(() => _props.props.mode || 'backTop')
const position = computed(() => _props.props.position || 'right')
const icon = computed(() => _props.props.icon || '')
const textColor = computed(() => _props.props.textColor || '')

const defaultIcon = computed(() => {
  const map: Record<string, string> = {
    backTop: 'bi:arrow-up',
    customerService: 'bi:headset',
    share: 'bi:share',
    link: 'bi:box-arrow-up-right',
  }
  return map[mode.value] || 'bi:arrow-up'
})

const visible = ref(mode.value !== 'backTop')

const syncScrollVisible = () => {
  if (mode.value !== 'backTop') return
  const threshold = Number(_props.props.showBackTopAfter) || 200
  visible.value = window.scrollY > threshold
}

onMounted(() => {
  if (mode.value === 'backTop') {
    window.addEventListener('scroll', syncScrollVisible)
    syncScrollVisible()
  }
})

onBeforeUnmount(() => {
  if (mode.value === 'backTop') {
    window.removeEventListener('scroll', syncScrollVisible)
  }
})

const href = computed(() => {
  if (mode.value === 'customerService' && _props.props.phone) {
    return `tel:${_props.props.phone}`
  }
  if (mode.value === 'link' && _props.props.link) {
    const link = _props.props.link
    return link.startsWith('http') ? link : `//${link}`
  }
  return undefined
})

const handleClick = (event: MouseEvent) => {
  if (mode.value === 'backTop') {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (mode.value === 'share') {
    event.preventDefault()
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href }).catch(() => {})
    } else {
      toast('分享功能暂未开启')
    }
  } else if (!href.value) {
    event.preventDefault()
  }
}

const actionStyle = computed<CSSProperties>(() => ({
  '--v-float-bg': _props.props.bgColor,
  '--v-float-color': textColor.value,
  '--v-float-bottom': _props.props.bottom || '96px',
}))
</script>

<style scoped lang="scss">
.visual-float-action {
  position: fixed;
  bottom: var(--v-float-bottom, 96px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--v-float-bg, var(--v-primary-1, #2563eb));
  color: var(--v-float-color, #fff);
  box-shadow: var(--v-shadow-soft);
  text-decoration: none;

  &--right {
    right: 16px;
  }

  &--left {
    left: 16px;
  }
}

.visual-float-enter-active,
.visual-float-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.visual-float-enter-from,
.visual-float-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>