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
import type { VisualTabsProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualTabsProps
}

defineOptions({
  name: 'VisualTabs',
})

const _props = defineProps<Props>()

const activeKey = ref(_props.props.activeKey || 'pane1')

const headerStyle = computed<CSSProperties>(() => ({
  '--v-tabs-active': _props.props.activeColor || '#409eff',
}))

watch(
  () => _props.props.activeKey,
  (v) => {
    if (v) activeKey.value = v
  }
)

const panes = computed(() => {
  const labels: Record<string, string | undefined> = {
    pane1: _props.props.label1,
    pane2: _props.props.label2,
    pane3: _props.props.label3,
  }
  return (['pane1', 'pane2', 'pane3'] as const)
    .filter((key) => labels[key])
    .map((key) => ({ key, label: labels[key] as string }))
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