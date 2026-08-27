<script setup lang="ts">
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'
import { cn } from '../../utils/cn'

const props = defineProps<ToasterProps>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <Sonner
    v-bind="delegatedProps"
    :class="cn('vu-group toaster', props.class)"
    :toast-options="{
      classes: {
        toast:
          'vu-group toast group-[.toaster]:vu-bg-background group-[.toaster]:vu-text-foreground group-[.toaster]:vu-border-border group-[.toaster]:vu-shadow-lg',
        description: 'group-[.toast]:vu-text-muted-foreground',
        actionButton:
          'group-[.toast]:vu-bg-primary group-[.toast]:vu-text-primary-foreground',
        cancelButton:
          'group-[.toast]:vu-bg-muted group-[.toast]:vu-text-muted-foreground',
      },
    }"
  />
</template>

<style>
  @import 'vue-sonner/style.css';
</style>