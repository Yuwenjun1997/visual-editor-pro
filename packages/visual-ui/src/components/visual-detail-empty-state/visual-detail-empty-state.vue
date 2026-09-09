<template>
  <div role="status" class="visual-detail-empty-state">
    <span class="visual-detail-empty-state__icon">
      <svg fill="none" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 3.5h7l3 3V20.5H7z" />
        <path d="M14 3.5v4h3M10 12h4M10 15.5h4" />
      </svg>
    </span>
    <strong>尚未选择{{ label }}</strong>
    <span>请在编辑器属性中选择{{ label }} ID 以预览详情内容</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: '内容',
})
</script>

<style scoped lang="scss">
.visual-detail-empty-state {
  --visual-detail-empty-state-text-2: var(--v-text-2);
  --visual-detail-empty-state-primary-opacity-6: var(--v-primary-opacity-6);
  --visual-detail-empty-state-shadow-soft: var(--v-shadow-soft);
  --visual-detail-empty-state-primary-1: var(--v-primary-color);
  --visual-detail-empty-state-text-1: var(--v-text-1);
  display: flex;
  min-height: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  color: var(--visual-detail-empty-state-text-2);
  text-align: center;

  &__icon {
    display: grid;
    width: 52px;
    height: 52px;
    margin-bottom: 4px;
    place-items: center;
    border-radius: 18px;
    background: var(--visual-detail-empty-state-primary-opacity-6);
    box-shadow: var(--visual-detail-empty-state-shadow-soft);
    color: var(--visual-detail-empty-state-primary-1);
  }

  &__icon svg {
    width: 26px;
    height: 26px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }
  & > strong {
    color: var(--visual-detail-empty-state-text-1);
    font-size: 15px;
  }
  & > span:last-child {
    max-width: 280px;
    font-size: 13px;
    line-height: 1.6;
  }
}
</style>
