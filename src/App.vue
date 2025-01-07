<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang='scss'>
@import './style/reset';

.slide-enter-active, .slide-leave-active {
    @apply transition-transform duration-100 ease-linear
  }
  .slide-enter-from, .slide-leave-to {
    @apply translate-y-full
  }
  .slide-enter-to, .slide-leave-from {
    @apply translate-y-0
  }
</style>
