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
  '--visual-section-section-line-color': _bindProps.value.lineColor,
  '--visual-section-section-line-width': _bindProps.value.lineWidth,
  '--visual-section-section-title-size': cssTextSizeVar(_bindProps.value.titleSize),
  '--visual-section-section-title-color': _bindProps.value.titleColor,
  '--visual-section-section-desc-size': cssTextSizeVar(_bindProps.value.descriptionSize),
  '--visual-section-section-desc-color': _bindProps.value.descriptionColor,
  '--visual-section-section-title-bold': _bindProps.value.bold ? 'bold' : '',
}))
</script>

<style scoped lang="scss">
.visual-section {
  --visual-section-spacing-sm: var(--v-spacing-sm);
  --visual-section-primary-1: var(--v-primary-1);
  --visual-section-text-3: var(--v-text-3);
  --visual-section-text-sm: var(--v-text-sm);
  .visual-section__inner {
    display: flex;
    flex-direction: column;
    line-height: 1;

    .visual-section__title {
      display: flex;
      color: var(--visual-section-section-title-color);
      font-size: var(--visual-section-section-title-size);
      gap: var(--visual-section-spacing-sm);

      .visual-section__title_text {
        font-weight: var(--visual-section-section-title-bold);
      }

      .visual-section__line {
        width: var(--visual-section-section-line-width, 2px);
        // margin-right: var(--visual-section-spacing-sm);
        background-color: var(--visual-section-section-line-color, var(--visual-section-primary-1));
        border-radius: var(--visual-section-section-line-width, 2px);
      }
    }

    .visual-section__desc {
      color: var(--visual-section-section-desc-color, var(--visual-section-text-3));
      font-size: var(--visual-section-section-desc-size, var(--visual-section-text-sm));
      margin-top: var(--visual-section-spacing-sm);
      line-height: 1.5;
    }
  }
}
</style>



