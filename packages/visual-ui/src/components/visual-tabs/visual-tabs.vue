<template>
  <visual-box class="visual-tabs" :class="_props.class" :styles="_props.styles">
    <TabsRoot v-model="activeKey" :default-value="panes[0]?.key">
      <TabsList :style="headerStyle" class="visual-tabs__header" :class="`visual-tabs__header--${bindVariant}`">
        <TabsTrigger v-for="pane in panes" :key="pane.key" :value="pane.key" class="visual-tabs__tab">
          {{ pane.label }}
        </TabsTrigger>
      </TabsList>
      <div
        v-for="pane in panes"
        v-show="activeKey === pane.key"
        :key="pane.key"
        role="tabpanel"
        class="visual-tabs__pane"
      >
        <slot :name="pane.key" />
      </div>
    </TabsRoot>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { TabsRoot, TabsList, TabsTrigger } from 'reka-ui'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualTabItem, VisualTabsProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualTabsProps
  listData?: VisualTabItem[]
  class?: string
}

defineOptions({
  name: 'VisualTabs',
})

const _props = defineProps<Props>()

const activeKey = ref('')

const bindVariant = computed(() => _props.props.variant || 'line')

const headerStyle = computed<CSSProperties>(() => ({
  '--visual-tabs-tabs-active': _props.props.activeColor || 'var(--visual-tabs-primary-1)',
  '--visual-tabs-tabs-text': _props.props.textColor || 'var(--visual-tabs-text-4)',
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
      activeKey.value = list[0]?.key || ''
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.visual-tabs {
  --visual-tabs-primary-1: var(--v-primary-1);
  --visual-tabs-text-4: var(--v-text-4);
  --visual-tabs-gray-2: var(--v-gray-2);
  --visual-tabs-radius-moody-sm: var(--v-radius-moody-sm);
  --visual-tabs-surface-2: var(--v-surface-2);
  --visual-tabs-font-display: var(--v-font-display);
  --visual-tabs-motion-fast: var(--v-motion-fast);
  --visual-tabs-ease-soft: var(--v-ease-soft);
  --visual-tabs-white: var(--v-white);
  .visual-tabs__header {
    display: flex;
    align-items: center;
    padding: 0;
    justify-content: flex-start;
    border-bottom: 1px solid var(--visual-tabs-gray-2);

    &--pill {
      gap: 6px;
      padding: 5px 8px;
      justify-content: center;
      border-bottom: 0;
      border-radius: var(--visual-tabs-radius-moody-sm);
      background-color: var(--visual-tabs-surface-2);
    }
  }

  .visual-tabs__tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    margin: 0 18px;
    font-size: 15px;
    cursor: pointer;
    background: none;
    border: none;
    color: var(--visual-tabs-tabs-text);

    &[data-state='active'] {
      color: var(--visual-tabs-tabs-active);
      font-weight: 600;
      font-family: var(--visual-tabs-font-display);
      border-bottom: 3px solid var(--visual-tabs-tabs-active);
      margin-bottom: -1px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .visual-tabs__header--pill {
    .visual-tabs__tab {
      margin: 0;
      padding: 6px 16px;
      border-radius: var(--visual-tabs-radius-moody-sm);
      transition:
        background-color var(--visual-tabs-motion-fast) var(--visual-tabs-ease-soft),
        color var(--visual-tabs-motion-fast) var(--visual-tabs-ease-soft),
        box-shadow var(--visual-tabs-motion-fast) var(--visual-tabs-ease-soft);

      &[data-state='active'] {
        background-color: var(--visual-tabs-tabs-active);
        color: var(--visual-tabs-white);
        font-family: var(--visual-tabs-font-display);
        border-bottom: 0;
        margin-bottom: 0;
        border-radius: var(--visual-tabs-radius-moody-sm);
      }
    }
  }

  .visual-tabs__pane {
    min-height: 40px;
    animation: vu-fade-up 0.4s var(--visual-tabs-ease-soft);
  }
}
</style>
