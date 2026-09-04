<template>
  <teleport v-if="isInited" :to="to" :disabled="props.disabled">
    <slot></slot>
  </teleport>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{ isDesign?: boolean; disabled?: boolean }>(),
  { isDesign: false, disabled: false },
)

const isInited = ref(false)

nextTick(()=> {
  isInited.value = true
})

const to = computed(() => (props.isDesign ? '#visual-stage-inner' : 'body'))
</script>
