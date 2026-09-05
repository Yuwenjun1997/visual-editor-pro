<template>
  <NuxtLoadingIndicator :height="3" :throttle="120" color="var(--v-primary-2, #4f46e5)" />
  <NuxtPage :page-key="(route) => route.path" />
</template>
