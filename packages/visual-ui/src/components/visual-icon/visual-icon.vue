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
  '--v-icon-color': _props.color,
  '--v-icon-size': _props.size,
  '--v-background-image-url': isPictureUrl(_props.icon) ? `url(${_props.icon})` : '',
}))

const _iconName = computed(() => {
  if (typeof _props.icon !== 'string') return ''
  const [, name] = _props.icon.split(':')
  return ICON_PREFIX + name
})

const _bindClassList = computed(() => [!isPictureUrl(_props.icon) ? _iconName.value : 'v-icon__is-image'])
</script>

<style lang="scss" scoped>
.visual-icon {
  line-height: 1;
  font-size: var(--v-icon-size);
  color: var(--v-icon-color);

  &.v-icon__is-image {
    width: var(--v-icon-size);
    height: var(--v-icon-size);
    background-image: var(--v-background-image-url);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
