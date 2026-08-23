<template>
  <visual-box class="visual-tabs" :styles="_props.styles">
    <div
      class="visual-tabs__header"
      :class="`visual-tabs__header--${_props.props.type || 'line'}`"
      :style="headerStyle"
    >
      <div
        v-for="pane in panes"
        :key="pane.key"
        class="visual-tabs__tab"
        :class="{ 'visual-tabs__tab--active': activeKey === pane.key }"
        :style="tabStyle(pane.key)"
        @click="activeKey = pane.key"
      >
        {{ pane.label }}
      </div>
    </div>
    <div class="visual-tabs__body">
      <div
        v-for="pane in panes"
        :key="pane.key"
        v-show="activeKey === pane.key"
        class="visual-tabs__pane"
      >
        <slot :name="pane.key" />
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualTabItem, VisualTabsProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualTabsProps
  listData?: VisualTabItem[]
}

defineOptions({
  name: 'VisualTabs',
})

const _props = defineProps<Props>()

const activeKey = ref('')

const headerStyle = computed<CSSProperties>(() => ({
  '--v-tabs-active': _props.props.activeColor || '#409eff',
}))

const panes = computed(() => {
  return (_props.listData || [])
    .map((item, index) => ({
      key: `tab-${index}`,
      label: item.label || `页签${index + 1}`,
    }))
    .filter((pane) => pane.label)
})

watch(
  panes,
  (list) => {
    if (list.length && !list.some((p) => p.key === activeKey.value)) {
      activeKey.value = list[0].key
    }
  },
  { immediate: true }
)

const tabStyle = (key: string): CSSProperties => {
  const active = activeKey.value === key
  const activeColor = _props.props.activeColor || '#409eff'
  if (active) {
    const isPill = _props.props.type === 'pill'
    return { color: isPill ? '#fff' : activeColor }
  }
  return { color: _props.props.textColor || '#666666' }
}
</script>

<style scoped lang="scss">
.visual-tabs {
  .visual-tabs__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;

    .visual-tabs__tab {
      padding: 10px 0;
      margin: 0 18px;
      font-size: 15px;
      cursor: pointer;
      background: transparent;
      border: none;
    }

    &--line {
      .visual-tabs__tab--active {
        border-bottom: 3px solid var(--v-tabs-active, #409eff);
        margin-bottom: -1px;
        font-weight: 600;
      }
    }

    &--pill {
      gap: 10px;
      padding: 10px 8px;
      border-bottom: 0;

      .visual-tabs__tab {
        margin: 0;
        padding: 7px 18px;
        border-radius: 999px;
        background-color: #f2f3f5;
      }

      .visual-tabs__tab--active {
        background-color: var(--v-tabs-active, #409eff);
      }
    }
  }

  .visual-tabs__body {
    .visual-tabs__pane {
      min-height: 40px;
    }
  }
}
</style>