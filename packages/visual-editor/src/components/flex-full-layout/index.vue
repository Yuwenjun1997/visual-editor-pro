<template>
  <div class="ve-flex ve-flex-col ve-h-full ve-relative">
    <slot name="header"></slot>
    <div class="ve-flex-1 ve-relative">
      <div class="ve-absolute ve-inset-0">
        <slot></slot>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
