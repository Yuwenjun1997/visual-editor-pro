<template>
  <visual-box :class="_props.class" class="visual-section" :styles="_props.styles">
    <div :style="_bindInnerStyles" class="visual-section__inner">
      <div class="visual-section__title">
        <template v-if="_bindProps.showLine">
          <div class="visual-section__line"></div>
        </template>
        <div class="visual-section__title_text">
          {{ _bindProps.title }}
        </div>
        <visual-icon
          v-if="_bindProps.icon"
          :icon="_bindProps.icon"
          :size="_bindProps.titleSize"
          :color="_bindProps.iconColor"
        />
      </div>
      <div v-if="_bindProps.description" class="visual-section__desc">
        {{ _bindProps.description }}
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import VisualIcon from '../visual-icon/visual-icon.vue'
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualSectionProps } from './interface'
import { cssTextSizeVar } from '../../utils/styles.utils'

interface Props {
  props: VisualSectionProps
  styles?: Partial<CSSProperties>
  class?: string
}

defineOptions({
  name: 'VisualSection',
})

const _props = defineProps<Props>()

const _bindProps = computed(() => _props.props)

const _bindInnerStyles = computed(() => ({
  '--v-section-line-color': _bindProps.value.lineColor,
  '--v-section-line-width': _bindProps.value.lineWidth,
  '--v-section-title-size': cssTextSizeVar(_bindProps.value.titleSize),
  '--v-section-title-color': _bindProps.value.titleColor,
  '--v-section-desc-size': cssTextSizeVar(_bindProps.value.descriptionSize),
  '--v-section-desc-color': _bindProps.value.descriptionColor,
  '--v-section-title-bold': _bindProps.value.bold ? 'bold' : '',
}))
</script>

<style scoped lang="scss">
.visual-section {
  .visual-section__inner {
    display: flex;
    flex-direction: column;
    line-height: 1;

    .visual-section__title {
      display: flex;
      color: var(--v-section-title-color);
      font-size: var(--v-section-title-size);
      gap: var(--v-spacing-sm);

      .visual-section__title_text {
        font-weight: var(--v-section-title-bold);
      }

      .visual-section__line {
        width: var(--v-section-line-width, 2px);
        // margin-right: var(--v-spacing-sm);
        background-color: var(--v-section-line-color, var(--v-primary-1));
        border-radius: var(--v-section-line-width, 2px);
      }
    }

    .visual-section__desc {
      color: var(--v-section-desc-color, var(--v-text-3));
      font-size: var(--v-section-desc-size, var(--v-text-sm));
      margin-top: var(--v-spacing-sm);
      line-height: 1.5;
    }
  }
}
</style>
