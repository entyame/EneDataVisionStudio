<template>
  <div class="hud-header">
    <!-- 装饰线 -->
    <div class="header-deco deco-left">
      <span class="deco-line"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line short"></span>
    </div>

    <!-- 标题区 -->
    <div class="header-center">
      <div class="header-title-row">
        <span class="title-bracket">&#x300C;</span>
        <h1 class="header-title">{{ title }}</h1>
        <span class="title-bracket">&#x300D;</span>
      </div>
      <div class="header-subtitle-row">
        <span class="sub-dot"></span>
        <p class="header-subtitle">{{ subtitle }}</p>
        <span class="sub-dot"></span>
      </div>
    </div>

    <!-- 时间 + 装饰 -->
    <div class="header-deco deco-right">
      <span class="deco-line short"></span>
      <div class="header-time">
        <span class="time-indicator"></span>
        <span class="time-text">{{ currentTime }}</span>
      </div>
      <span class="deco-diamond"></span>
      <span class="deco-line"></span>
    </div>

    <!-- 底部扫描发光条 -->
    <div class="header-glow-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  title?: string
  subtitle?: string
}>()

const currentTime = ref('')

function updateTime(): void {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}  ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.hud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 36px;
  background: linear-gradient(180deg, rgba(8, 10, 26, 0.95) 0%, rgba(10, 14, 30, 0.7) 100%);
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
  position: relative;
  overflow: visible;
  z-index: 10;
  backdrop-filter: blur(8px);
}

/* ---- 底部发光条 ---- */
.header-glow-bar {
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hud-cyan), var(--hud-jade), var(--hud-cyan), transparent);
  box-shadow: 0 0 12px var(--hud-cyan-glow), 0 0 30px var(--hud-cyan-dim);
  animation: hud-data-flow 6s linear infinite;
  background-size: 200% 100%;
}

/* ---- 左右装饰 ---- */
.header-deco {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.deco-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hud-cyan-dim));
}
.deco-line.short { width: 25px; }

.deco-right .deco-line {
  background: linear-gradient(90deg, var(--hud-cyan-dim), transparent);
}

.deco-diamond {
  width: 7px;
  height: 7px;
  background: var(--hud-cyan);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 0 10px var(--hud-cyan-glow);
  animation: hud-breathe 2.5s ease-in-out infinite;
}

/* ---- 标题中心 ---- */
.header-center {
  text-align: center;
  flex: 1;
}

.header-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-bracket {
  font-size: 28px;
  color: var(--hud-cyan);
  opacity: 0.6;
  text-shadow: 0 0 10px var(--hud-cyan-glow);
  font-family: serif;
  line-height: 1;
}

.header-title {
  font-family: var(--hud-font-display);
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, var(--hud-cyan) 50%, var(--hud-jade) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 12px rgba(0, 229, 255, 0.4));
}

.header-subtitle-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 2px;
}

.sub-dot {
  width: 3px;
  height: 3px;
  background: var(--hud-jade);
  border-radius: 50%;
  box-shadow: 0 0 4px var(--hud-jade-glow);
}

.header-subtitle {
  font-family: var(--hud-font-body);
  font-size: 13px;
  color: var(--hud-text-secondary);
  letter-spacing: 4px;
  margin: 0;
}

/* ---- 时间 ---- */
.header-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: rgba(0, 229, 255, 0.06);
  border: 1px solid rgba(0, 229, 255, 0.2);
  position: relative;
}

/* 时间框的四角 */
.header-time::before,
.header-time::after {
  content: '';
  position: absolute;
  width: 6px; height: 6px;
}
.header-time::before { top: -1px; left: -1px; border-top: 1px solid var(--hud-cyan); border-left: 1px solid var(--hud-cyan); }
.header-time::after  { bottom: -1px; right: -1px; border-bottom: 1px solid var(--hud-cyan); border-right: 1px solid var(--hud-cyan); }

.time-indicator {
  width: 5px;
  height: 5px;
  background: var(--hud-jade);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--hud-jade-glow);
  animation: hud-breathe 2s ease-in-out infinite;
}

.time-text {
  font-family: var(--hud-font-mono);
  font-size: 14px;
  color: var(--hud-text-cyan);
  letter-spacing: 1px;
}
</style>
