<template>
  <div class="wa-h-full wa-flex wa-items-center wa-gap-4">
    <logo-view />
    <header-tools class="wa-ml-auto" />
    <user-profile />
  </div>
</template>

<script setup lang="ts">
import HeaderTools from './HeaderTools.vue'
import UserProfile from './UserProfile.vue'
import LogoView from './LogoView.vue'
</script>

<style scoped></style>
