<template>
  <visual-box
    class="visual-tabs"
    :styles="_props.styles"
    :class="_props.class"
  >
    <TabsRoot v-model="activeKey">
      <TabsList
        class="visual-tabs__header"
        :class="`visual-tabs__header--${bindVariant}`"
        :style="headerStyle"
      >
        <TabsTrigger
          v-for="pane in panes"
          :key="pane.key"
          :value="pane.key"
          class="visual-tabs__tab"
        >
          {{ pane.label }}
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-for="pane in panes"
        :key="pane.key"
        :value="pane.key"
        class="visual-tabs__pane"
      >
        <slot :name="pane.key" />
      </TabsContent>
    </TabsRoot>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
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
  '--v-tabs-active': _props.props.activeColor || 'var(--v-primary-1)',
  '--v-tabs-text': _props.props.textColor || 'var(--v-text-4)',
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
  { immediate: true },
)
</script>

<style scoped lang="scss">
.visual-tabs {
  .visual-tabs__header {
    display: flex;
    align-items: center;
    padding: 0;
    justify-content: flex-start;
    border-bottom: 1px solid var(--v-gray-2);

    &--pill {
      gap: 6px;
      padding: 5px 8px;
      justify-content: center;
      border-bottom: 0;
      border-radius: var(--v-radius-moody-sm);
      background-color: var(--v-surface-2);
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
    color: var(--v-tabs-text);

    &[data-state='active'] {
      color: var(--v-tabs-active);
      font-weight: 600;
      font-family: var(--v-font-display);
      border-bottom: 3px solid var(--v-tabs-active);
      margin-bottom: -1px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .visual-tabs__header--pill {
    .visual-tabs__tab {
      margin: 0;
      padding: 6px 16px;
      border-radius: var(--v-radius-moody-sm);
      transition:
        background-color var(--v-motion-fast) var(--v-ease-soft),
        color var(--v-motion-fast) var(--v-ease-soft),
        box-shadow var(--v-motion-fast) var(--v-ease-soft);

      &[data-state='active'] {
        background-color: var(--v-tabs-active);
        color: var(--v-white);
        font-family: var(--v-font-display);
        border-bottom: 0;
        margin-bottom: 0;
        border-radius: var(--v-radius-moody-sm);
      }
    }
  }

  .visual-tabs__pane {
    min-height: 40px;
    animation: vu-fade-up 0.4s var(--v-ease-soft);
  }
}
</style>
