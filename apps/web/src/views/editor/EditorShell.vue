<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

defineOptions({ name: 'EditorShell' })
</script>
