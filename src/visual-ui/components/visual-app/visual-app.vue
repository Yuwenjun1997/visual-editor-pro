<template>
  <div class="visual-app" :class="_bindClassList" :style="_bindStyles">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useTheme } from '../../hooks/useTheme'
import { useSafeArea } from '../../hooks/useSafeArea'
import type { VisualAppProps } from './interface'

defineOptions({
  name: 'v-app',
})

const _props = withDefaults(defineProps<VisualAppProps>(), {
  safeAreaBottom: true,
  bgColor: 'transparent',
})

const { themeConfig, themeName, colorVar, colorVal } = useTheme()

const _currentTheme = computed(() => themeConfig.value.theme[themeName.value])

const { bottom } = useSafeArea()

const _safeAreaBottom = computed(() =>
  _props.safeAreaBottom ? bottom.value : 0
)

// 将 #RRGGBB 转为 "h h% l%" HSL 三元组，供 shadcn-vue 的 hsl(var(--x)) 使用
const hexToHslTriplet = (hex: string): string => {
  const raw = hex.replace('#', '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  const num = parseInt(full, 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2 / 255
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

const _shadcnVars = computed<Record<string, string>>(() => {
  const theme = _currentTheme.value
  const t = (key: string) => theme[key] || '#000000'
  return {
    '--background': hexToHslTriplet(colorVal(_props.bgColor)?.startsWith('#') ? colorVal(_props.bgColor)! : t('white')),
    '--foreground': hexToHslTriplet(t('text-1')),
    '--primary': hexToHslTriplet(t('primary-1')),
    '--primary-foreground': hexToHslTriplet(t('white')),
    '--border': hexToHslTriplet(t('gray')),
    '--input': hexToHslTriplet(t('gray')),
    '--ring': hexToHslTriplet(t('primary-3')),
    '--muted': hexToHslTriplet(t('gray')),
    '--muted-foreground': hexToHslTriplet(t('text-4')),
    '--accent': hexToHslTriplet(t('gray')),
    '--accent-foreground': hexToHslTriplet(t('text-1')),
    '--secondary': hexToHslTriplet(t('gray')),
    '--secondary-foreground': hexToHslTriplet(t('text-1')),
    '--destructive': hexToHslTriplet(t('error-1')),
    '--destructive-foreground': hexToHslTriplet(t('white')),
    '--popover': hexToHslTriplet(t('white')),
    '--popover-foreground': hexToHslTriplet(t('text-1')),
    '--card': hexToHslTriplet(t('white')),
    '--card-foreground': hexToHslTriplet(t('text-1')),
    '--radius': '0.625rem',
  }
})

const _bindStyles = computed(() => ({
  ...Object.entries(_currentTheme.value).reduce((prev, [key, value]) => {
    prev[`--v-${key}`] = value
    return prev
  }, {} as CSSProperties),
  '--v-bg-color': colorVar(_props.bgColor),
  '--v-safe-area-bottom': `${_safeAreaBottom.value}px`,
  ..._shadcnVars.value,
}))

const _bindClassList = computed(() => ({
  [themeName.value]: true,
}))
</script>

<style lang="scss">
.visual-app {
  height: 100%;
  flex: 1;
  overflow: hidden;
  background-color: var(--v-bg-color);
  color: var(--v-text-1);
  font-size: var(--v-text-md);

  &::after {
    content: '';
    display: block;
    height: var(--v-safe-area-bottom);
  }
}
</style>
