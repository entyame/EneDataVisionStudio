<template>
  <div class="hud-panel" :class="[`hud-panel--${accent}`]">
    <!-- 四角 HUD 括号 -->
    <div class="hud-bracket tl"></div>
    <div class="hud-bracket tr"></div>
    <div class="hud-bracket bl"></div>
    <div class="hud-bracket br"></div>

    <!-- 上边线：坐标标记 -->
    <div class="hud-top-edge">
      <span class="hud-coord">{{ coordLabel }}</span>
      <span class="hud-edge-line"></span>
      <span class="hud-coord">{{ coordValue }}</span>
    </div>

    <!-- 扫描线 -->
    <div class="hud-scan-line"></div>

    <!-- 标题区 -->
    <div class="panel-header" v-if="title || $slots.header">
      <slot name="header">
        <div class="panel-title-row">
          <span class="panel-indicator"></span>
          <span class="panel-title">{{ title }}</span>
        </div>
      </slot>
    </div>

    <!-- 内容区 -->
    <div class="panel-body">
      <slot />
    </div>

    <!-- 底部状态条 -->
    <div class="hud-bottom-bar">
      <span class="hud-status-dot"></span>
      <span class="hud-status-text">ACTIVE</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  accent?: 'cyan' | 'jade' | 'gold' | 'purple'
}>()

const coordLabel = computed(() => {
  const labels: Record<string, string> = { cyan: 'SYS.01', jade: 'SYS.02', gold: 'SYS.03', purple: 'SYS.04' }
  return labels[props.accent || 'cyan']
})
const coordValue = computed(() => `N${Math.floor(Math.random() * 90 + 10)}.${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`)
</script>

<style scoped>
/* ========== 面板容器 ========== */
.hud-panel {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--hud-panel-bg);
  backdrop-filter: var(--hud-glass-blur);
  -webkit-backdrop-filter: var(--hud-glass-blur);
  border: 1px solid var(--hud-panel-border);
  box-shadow: var(--hud-panel-glow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.6s;
}

.hud-panel:hover {
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.1), 0 0 80px rgba(0, 229, 255, 0.04);
}

/* ---- 强调色变体 ---- */
.hud-panel--cyan  { --accent-color: var(--hud-cyan);   --accent-dim: var(--hud-cyan-dim);   --accent-glow: var(--hud-cyan-glow); }
.hud-panel--jade  { --accent-color: var(--hud-jade);   --accent-dim: var(--hud-jade-dim);   --accent-glow: var(--hud-jade-glow); }
.hud-panel--gold  { --accent-color: var(--hud-gold);   --accent-dim: var(--hud-gold-dim);   --accent-glow: var(--hud-gold-glow); }
.hud-panel--purple{ --accent-color: var(--hud-purple); --accent-dim: var(--hud-purple-dim); --accent-glow: var(--hud-purple-glow); }
.hud-panel--cyan  { --accent-color: var(--hud-cyan);   --accent-dim: var(--hud-cyan-dim);   --accent-glow: var(--hud-cyan-glow); }

/* ========== 四角括号 ========== */
.hud-bracket {
  position: absolute;
  width: 18px;
  height: 18px;
  z-index: 2;
  pointer-events: none;
}

.hud-bracket.tl {
  top: 2px; left: 2px;
  border-top: 2px solid var(--accent-color, var(--hud-cyan));
  border-left: 2px solid var(--accent-color, var(--hud-cyan));
  box-shadow: -1px -1px 6px var(--accent-glow, var(--hud-cyan-glow));
}

.hud-bracket.tr {
  top: 2px; right: 2px;
  border-top: 2px solid var(--accent-color, var(--hud-cyan));
  border-right: 2px solid var(--accent-color, var(--hud-cyan));
  box-shadow: 1px -1px 6px var(--accent-glow, var(--hud-cyan-glow));
}

.hud-bracket.bl {
  bottom: 2px; left: 2px;
  border-bottom: 2px solid var(--accent-color, var(--hud-cyan));
  border-left: 2px solid var(--accent-color, var(--hud-cyan));
  box-shadow: -1px 1px 6px var(--accent-glow, var(--hud-cyan-glow));
}

.hud-bracket.br {
  bottom: 2px; right: 2px;
  border-bottom: 2px solid var(--accent-color, var(--hud-cyan));
  border-right: 2px solid var(--accent-color, var(--hud-cyan));
  box-shadow: 1px 1px 6px var(--accent-glow, var(--hud-cyan-glow));
}

/* ========== 顶部坐标栏 ========== */
.hud-top-edge {
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 1px;
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-edge-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-dim, var(--hud-cyan-dim)), var(--accent-color, var(--hud-cyan)), var(--accent-dim, var(--hud-cyan-dim)));
}

.hud-coord {
  font-family: var(--hud-font-mono);
  font-size: 8px;
  color: var(--accent-color, var(--hud-cyan));
  opacity: 0.6;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* ========== 扫描线 ========== */
.hud-scan-line {
  position: absolute;
  left: 4px;
  right: 4px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-color, var(--hud-cyan)), transparent);
  box-shadow: 0 0 6px var(--accent-glow, var(--hud-cyan-glow));
  pointer-events: none;
  z-index: 3;
  animation: hud-scan 4.5s ease-in-out infinite;
  opacity: 0.45;
}

@keyframes hud-scan {
  0%   { top: -2px; opacity: 0; }
  8%   { opacity: 0.6; }
  92%  { opacity: 0.6; }
  100% { top: calc(100% + 2px); opacity: 0; }
}

/* ========== 标题栏 ========== */
.panel-header {
  position: relative;
  z-index: 1;
  padding: 14px 16px 6px;
  flex-shrink: 0;
}

.panel-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-indicator {
  width: 8px;
  height: 8px;
  background: var(--accent-color, var(--hud-cyan));
  border-radius: 0;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 0 8px var(--accent-glow, var(--hud-cyan-glow));
  animation: hud-breathe 2s ease-in-out infinite;
}

.panel-title {
  font-family: var(--hud-font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--hud-text-primary);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* ========== 内容区 ========== */
.panel-body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 2px 10px 10px;
  overflow: hidden;
}

/* ========== 底部状态条 ========== */
.hud-bottom-bar {
  position: absolute;
  bottom: 3px;
  left: 12px;
  right: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}

.hud-status-dot {
  width: 4px;
  height: 4px;
  background: var(--accent-color, var(--hud-cyan));
  border-radius: 50%;
  box-shadow: 0 0 4px var(--accent-glow, var(--hud-cyan-glow));
  animation: hud-breathe 2s ease-in-out infinite;
}

.hud-status-text {
  font-family: var(--hud-font-mono);
  font-size: 7px;
  color: var(--accent-color, var(--hud-cyan));
  opacity: 0.5;
  letter-spacing: 2px;
}
</style>
