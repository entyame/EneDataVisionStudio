<template>
  <div class="base-panel">
    <div class="panel-border">
      <div class="border-corner top-left"></div>
      <div class="border-corner top-right"></div>
      <div class="border-corner bottom-left"></div>
      <div class="border-corner bottom-right"></div>
      <div class="border-line top-line"></div>
      <div class="border-line bottom-line"></div>
      <div class="border-line left-line"></div>
      <div class="border-line right-line"></div>
    </div>
    <div class="panel-header" v-if="title || $slots.header">
      <slot name="header">
        <span class="panel-title">{{ title }}</span>
      </slot>
    </div>
    <div class="panel-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.base-panel {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(60, 30, 100, 0.25) 0%, rgba(20, 10, 50, 0.45) 100%);
  border: 1px solid rgba(140, 100, 220, 0.3);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ---- 装饰边框 ---- */
.panel-border {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.border-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: #c0a0ff;
  border-style: solid;
}
.top-left {
  top: 2px;
  left: 2px;
  border-width: 2px 0 0 2px;
}
.top-right {
  top: 2px;
  right: 2px;
  border-width: 2px 2px 0 0;
}
.bottom-left {
  bottom: 2px;
  left: 2px;
  border-width: 0 0 2px 2px;
}
.bottom-right {
  bottom: 2px;
  right: 2px;
  border-width: 0 2px 2px 0;
}

.border-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(192, 160, 255, 0.4), transparent);
}
.top-line {
  top: 0;
  left: 20px;
  right: 20px;
  height: 1px;
}
.bottom-line {
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
}
.left-line {
  left: 0;
  top: 20px;
  bottom: 20px;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(192, 160, 255, 0.4), transparent);
}
.right-line {
  right: 0;
  top: 20px;
  bottom: 20px;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(192, 160, 255, 0.4), transparent);
}

/* ---- 面板头部 ---- */
.panel-header {
  position: relative;
  z-index: 1;
  padding: 14px 16px 8px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 17px;
  font-weight: 600;
  color: #e0d0ff;
  letter-spacing: 2px;
  padding-left: 12px;
  border-left: 3px solid #c0a0ff;
}

/* ---- 面板内容 ---- */
.panel-body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 4px 12px 12px;
  overflow: hidden;
}
</style>
