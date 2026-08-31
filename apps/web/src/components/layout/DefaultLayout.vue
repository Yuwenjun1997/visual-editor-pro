<template>
  <el-container class="wa-h-screen">
    <el-header style="border-bottom: var(--el-border)">
      <header-navbar />
    </el-header>
    <el-container>
      <slot></slot>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import HeaderNavbar from './components/HeaderNavbar.vue'
</script>

<style scoped></style>
