<template>
  <visual-box class="visual-search" :class="_props.class" :styles="_props.styles">
    <form :style="innerStyle" class="visual-search__inner" @submit.prevent="handleSubmit">
      <i class="bi bi-search visual-search__search-icon" />
      <input
        v-model="keyword"
        type="search"
        class="visual-search__input"
        :placeholder="_props.props.placeholder || '搜索关键词'"
      />
      <button type="submit" :style="btnStyle" class="visual-search__btn">
        {{ _props.props.buttonText || '搜索' }}
      </button>
    </form>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import { toast } from '../../utils/toast'
import type { VisualSearchProps } from './interface'
import { appendVisualUrlQuery, navigateVisualUrl } from '../../utils/url'
import { useH5Runtime } from '../../hooks/useH5Runtime'
import { useTheme } from '../../hooks/useTheme'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualSearchProps
  class?: string
}

defineOptions({
  name: 'VisualSearch',
})

const _props = defineProps<Props>()
const runtime = useH5Runtime()
const { colorVar } = useTheme()

const keyword = ref('')

const innerStyle = computed<CSSProperties>(() => ({
  '--visual-search-search-radius': _props.props.radius || '999px',
}))

const btnStyle = computed<CSSProperties>(() => ({
  '--visual-search-search-btn-bg': colorVar(_props.props.buttonColor),
}))

const handleSubmit = () => {
  const value = keyword.value.trim()
  const link = _props.props.confirmLink
  if (link) {
    const target = appendVisualUrlQuery(link, `keyword=${encodeURIComponent(value)}`)
    if (target) navigateVisualUrl(target, runtime)
  } else {
    toast(value ? `搜索：${value}` : '请输入搜索关键词')
  }
}
</script>

<style scoped lang="scss">
.visual-search {
  --visual-search-background-color: var(--v-foreground-color);
  --visual-search-button-text-color: var(--v-white);
  --visual-search-primary-2: var(--v-primary-2);
  --visual-search-text-2: var(--v-text-2);
  --visual-search-text-3: var(--v-text-3);
  --visual-search-primary-1: var(--v-primary-color);
  --visual-search-motion-fast: var(--v-motion-fast);
  --visual-search-ease-soft: var(--v-ease-soft);
  .visual-search__inner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 6px 6px 12px;
    border-radius: var(--visual-search-search-radius, 999px);
    background: var(--visual-search-background-color);

    &:focus-within {
      box-shadow: inset 0 0 0 2px var(--visual-search-primary-2, rgba(37, 99, 235, 0.35));
    }
  }

  .visual-search__search-icon {
    flex-shrink: 0;
    font-size: 16px;
    color: var(--visual-search-text-2, #8a93a6);
  }

  .visual-search__input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: inherit;

    &::placeholder {
      color: var(--visual-search-text-3, #b3bac7);
    }
  }

  .visual-search__btn {
    flex-shrink: 0;
    padding: 9px 18px;
    border: 0;
    border-radius: var(--visual-search-search-radius, 999px);
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    background-color: var(--visual-search-search-btn-bg, var(--visual-search-primary-1, #2563eb));
    color: var(--visual-search-button-text-color);
    cursor: pointer;
    transition: opacity var(--visual-search-motion-fast) var(--visual-search-ease-soft);

    &:hover {
      opacity: 0.92;
    }

    &:active {
      opacity: 0.85;
    }
  }
}
</style>
