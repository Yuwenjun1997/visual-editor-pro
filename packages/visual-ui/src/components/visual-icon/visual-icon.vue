<template>
  <div class="visual-icon" :style="_bindStyles" :class="[_bindClassList, _props.class]" />
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { isPictureUrl } from '../../utils/validate'

interface Props {
  icon: string
  color?: string
  size?: string
  class?: string
}

defineOptions({
  name: 'VisualIcon',
})

const ICON_PREFIX = 'bi-'

const _props = defineProps<Props>()

const _bindStyles = computed<CSSProperties>(() => ({
  '--visual-icon-icon-color': _props.color,
  '--visual-icon-icon-size': _props.size,
  '--visual-icon-background-image-url': isPictureUrl(_props.icon) ? `url(${_props.icon})` : '',
}))

const _iconName = computed(() => {
  if (typeof _props.icon !== 'string') return ''
  const [, name] = _props.icon.split(':')
  return ICON_PREFIX + name
})

const _bindClassList = computed(() => [!isPictureUrl(_props.icon) ? _iconName.value : 'visual-icon--image'])
</script>

<style lang="scss" scoped>
.visual-icon {
  line-height: 1;
  font-size: var(--visual-icon-icon-size);
  color: var(--visual-icon-icon-color);

  &--image {
    width: var(--visual-icon-icon-size);
    height: var(--visual-icon-icon-size);
    background-image: var(--visual-icon-background-image-url);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
