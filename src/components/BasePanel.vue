<template>
  <div class="hud-panel">
    <!-- 四角 HUD 括号 -->
    <div class="hud-bracket tl"></div>
    <div class="hud-bracket tr"></div>
    <div class="hud-bracket bl"></div>
    <div class="hud-bracket br"></div>

    <!-- 上边线 + 坐标 -->
    <div class="hud-top-edge">
      <span class="hud-coord">{{ coordLabel }}</span>
      <span class="hud-edge-line"></span>
      <span class="hud-coord">{{ coordValue }}</span>
    </div>

    <!-- 扫描线 -->
    <div class="hud-scan-line"></div>

    <!-- 标题 -->
    <div class="panel-header" v-if="title || $slots.header">
      <slot name="header">
        <div class="panel-title-row">
          <span class="panel-indicator"></span>
          <span class="panel-title">{{ title }}</span>
        </div>
      </slot>
    </div>

    <!-- 内容 -->
    <div class="panel-body">
      <slot />
    </div>

    <!-- 底部状态 -->
    <div class="hud-bottom-bar">
      <span class="hud-status-dot"></span>
      <span class="hud-status-text">ACTIVE</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()

const labels = ['SYS.01','SYS.02','SYS.03','SYS.04','SYS.05','SYS.06','SYS.07']
const coordLabel = labels[Math.floor(Math.random() * labels.length)]
const coordValue = `N${Math.floor(Math.random()*90+10)}.${String(Math.floor(Math.random()*100)).padStart(2,'0')}`
</script>

<style scoped>
.hud-panel {
  position: relative;
  width: 100%; height: 100%;
  background: var(--hud-panel-bg);
  backdrop-filter: var(--hud-glass-blur);
  -webkit-backdrop-filter: var(--hud-glass-blur);
  border: 1px solid var(--hud-panel-border);
  box-shadow: var(--hud-panel-glow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ---- 四角括号 ---- */
.hud-bracket {
  position: absolute;
  width: 16px; height: 16px;
  z-index: 2;
  pointer-events: none;
  border-color: var(--hud-purple);
}
.hud-bracket.tl { top: 1px; left: 1px; border-top: 2px solid; border-left: 2px solid; box-shadow: -1px -1px 5px var(--hud-purple-dim); }
.hud-bracket.tr { top: 1px; right: 1px; border-top: 2px solid; border-right: 2px solid; box-shadow: 1px -1px 5px var(--hud-purple-dim); }
.hud-bracket.bl { bottom: 1px; left: 1px; border-bottom: 2px solid; border-left: 2px solid; box-shadow: -1px 1px 5px var(--hud-purple-dim); }
.hud-bracket.br { bottom: 1px; right: 1px; border-bottom: 2px solid; border-right: 2px solid; box-shadow: 1px 1px 5px var(--hud-purple-dim); }

/* ---- 顶部坐标 ---- */
.hud-top-edge {
  position: absolute;
  top: 0; left: 20px; right: 20px;
  height: 1px;
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hud-edge-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--hud-purple-dim), var(--hud-purple), var(--hud-purple-dim));
}
.hud-coord {
  font-family: var(--hud-font-mono);
  font-size: 8px;
  color: var(--hud-purple);
  opacity: 0.55;
  letter-spacing: 1px;
}

/* ---- 扫描线 ---- */
.hud-scan-line {
  position: absolute;
  left: 4px; right: 4px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hud-purple), transparent);
  box-shadow: 0 0 5px var(--hud-purple-dim);
  pointer-events: none;
  z-index: 3;
  animation: hud-scan 5s ease-in-out infinite;
  opacity: 0.4;
}

/* ---- 标题 ---- */
.panel-header {
  position: relative;
  z-index: 1;
  padding: 16px 16px 6px;
  flex-shrink: 0;
}
.panel-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.panel-indicator {
  width: 8px; height: 8px;
  background: var(--hud-purple);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 0 8px var(--hud-purple-glow);
  animation: hud-breathe 2s ease-in-out infinite;
}
.panel-title {
  font-family: var(--hud-font-display);
  font-size: 15px;
  font-weight: 700;
  color: #e0d8f4;
  letter-spacing: 3px;
  text-transform: uppercase;
}

/* ---- 内容 ---- */
.panel-body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 2px 10px 10px;
  overflow: hidden;
}

/* ---- 底部状态 ---- */
.hud-bottom-bar {
  position: absolute;
  bottom: 4px; left: 12px; right: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}
.hud-status-dot {
  width: 4px; height: 4px;
  background: var(--hud-purple);
  border-radius: 50%;
  box-shadow: 0 0 4px var(--hud-purple-glow);
  animation: hud-breathe 2.5s ease-in-out infinite;
}
.hud-status-text {
  font-family: var(--hud-font-mono);
  font-size: 7px;
  color: var(--hud-purple);
  opacity: 0.45;
  letter-spacing: 2px;
}
</style>
