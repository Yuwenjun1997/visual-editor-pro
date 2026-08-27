<template>
  <div class="preview-group">
    <div v-for="element in blocks" :key="element._vid" class="preview-block">
      <use-component :block="element">
        <template v-for="(value, key) in element.slots" #[key] :key="key">
          <PreviewBlocks :blocks="value.blocks" />
        </template>
      </use-component>
    </div>
  </div>
</template>

<script setup lang="ts">
import UseComponent from '../visual-blocks/components/use-component.vue'
import type { VisualBlockData } from '../../types/visual-editor'

defineOptions({
  name: 'PreviewBlocks',
})

interface Props {
  blocks: VisualBlockData[]
}

defineProps<Props>()
</script>
