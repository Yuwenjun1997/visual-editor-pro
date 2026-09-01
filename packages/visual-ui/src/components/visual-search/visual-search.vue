<template>
  <visual-box
    class="visual-search"
    :styles="_props.styles"
    :class="_props.class"
  >
    <form
      class="visual-search__inner"
      :style="innerStyle"
      @submit.prevent="handleSubmit"
    >
      <i class="bi bi-search visual-search__search-icon" />
      <input
        v-model="keyword"
        class="visual-search__input"
        type="search"
        :placeholder="_props.props.placeholder || '搜索关键词'"
      />
      <button
        type="submit"
        class="visual-search__btn"
        :style="btnStyle"
      >
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

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualSearchProps
  class?: string
}

defineOptions({
  name: 'VisualSearch',
})

const _props = defineProps<Props>()

const keyword = ref('')

const innerStyle = computed<CSSProperties>(() => ({
  '--v-search-radius': _props.props.radius || '999px',
}))

const btnStyle = computed<CSSProperties>(() => ({
  '--v-search-btn-bg': _props.props.buttonColor,
}))

const handleSubmit = () => {
  const value = keyword.value.trim()
  const link = _props.props.confirmLink
  if (link) {
    const sep = link.includes('?') ? '&' : '?'
    window.location.href = `${link}${sep}keyword=${encodeURIComponent(value)}`
  } else {
    toast(value ? `搜索：${value}` : '请输入搜索关键词')
  }
}
</script>

<style scoped lang="scss">
.visual-search {
  .visual-search__inner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 6px 6px 12px;
    border-radius: var(--v-search-radius, 999px);
    background: #f3f5ff;

    &:focus-within {
      box-shadow: inset 0 0 0 2px var(--v-primary-2, rgba(37, 99, 235, 0.35));
    }
  }

  .visual-search__search-icon {
    flex-shrink: 0;
    font-size: 16px;
    color: var(--v-text-2, #8a93a6);
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
      color: var(--v-text-3, #b3bac7);
    }
  }

  .visual-search__btn {
    flex-shrink: 0;
    padding: 9px 18px;
    border: 0;
    border-radius: var(--v-search-radius, 999px);
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    background-color: var(--v-search-btn-bg, var(--v-primary-1, #2563eb));
    color: #fff;
    cursor: pointer;
    transition: opacity var(--v-motion-fast) var(--v-ease-soft);

    &:hover {
      opacity: 0.92;
    }

    &:active {
      opacity: 0.85;
    }
  }
}
</style>
