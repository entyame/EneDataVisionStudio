<template>
  <DashboardView />
</template>

<script setup lang="ts">
import DashboardView from '@/views/DashboardView.vue'
</script>

<style>
/* ---- 全局样式重置 ---- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #040210;
}

#app {
  width: 100%;
  height: 100%;
}

/* ---- 滚动条样式 ---- */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(140, 100, 220, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 100, 220, 0.5);
}
</style>
