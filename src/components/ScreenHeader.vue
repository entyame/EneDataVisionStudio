<template>
  <div class="hud-header">
    <div class="header-deco deco-left">
      <span class="deco-line"></span>
      <span class="deco-diamond"></span>
      <span class="deco-line short"></span>
    </div>

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

    <div class="header-deco deco-right">
      <span class="deco-line short"></span>
      <div class="header-time">
        <span class="time-indicator"></span>
        <span class="time-text">{{ currentTime }}</span>
      </div>
      <span class="deco-diamond"></span>
      <span class="deco-line"></span>
    </div>

    <div class="header-glow-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ title?: string; subtitle?: string }>()

const currentTime = ref('')
function updateTime() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}  ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
let t: ReturnType<typeof setInterval> | null = null
onMounted(() => { updateTime(); t = setInterval(updateTime, 1000) })
onUnmounted(() => { if (t) clearInterval(t) })
</script>

<style scoped>
.hud-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 80px;
  padding: 0 36px;
  background: linear-gradient(180deg, rgba(10, 6, 22, 0.95) 0%, rgba(12, 8, 26, 0.75) 100%);
  border-bottom: 1px solid rgba(179, 136, 255, 0.18);
  position: relative;
  overflow: visible;
  z-index: 10;
  backdrop-filter: blur(4px);
}

/* ---- 底部发光条 ---- */
.header-glow-bar {
  position: absolute;
  bottom: 0; left: 5%; right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hud-purple), var(--hud-gold), var(--hud-purple), transparent);
  box-shadow: 0 0 12px var(--hud-purple-glow), 0 0 30px var(--hud-purple-dim);
  animation: hud-data-flow 6s linear infinite;
  background-size: 200% 100%;
}

/* ---- 左右装饰 ---- */
.deco-left  { justify-self: start; }
.deco-right { justify-self: end; }
.header-deco {
  display: flex; align-items: center; gap: 10px;
}
.deco-line {
  width: 50px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--hud-purple-dim));
}
.deco-line.short { width: 25px; }
.deco-right .deco-line {
  background: linear-gradient(90deg, var(--hud-purple-dim), transparent);
}
.deco-diamond {
  width: 7px; height: 7px;
  background: var(--hud-purple);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 0 10px var(--hud-purple-glow);
  animation: hud-breathe 2.5s ease-in-out infinite;
}

/* ---- 标题 ---- */
.header-center { text-align: center; flex: 1; }
.header-title-row {
  display: flex; align-items: center; justify-content: center; gap: 12px;
}
.title-bracket {
  font-size: 30px; color: var(--hud-purple); opacity: 0.6;
  text-shadow: 0 0 10px var(--hud-purple-dim);
  font-family: serif; line-height: 1;
}
.header-title {
  font-family: var(--hud-font-display);
  font-size: 32px; font-weight: 700;
  letter-spacing: 3px; margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, var(--hud-purple-bright) 40%, var(--hud-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(179, 136, 255, 0.35));
}
.header-subtitle-row {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-top: 4px;
}
.sub-dot {
  width: 3px; height: 3px;
  background: var(--hud-gold);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--hud-gold-glow);
}
.header-subtitle {
  font-family: var(--hud-font-body);
  font-size: 14px;
  color: var(--hud-text-secondary);
  letter-spacing: 4px; margin: 0;
}

/* ---- 时间 ---- */
.header-time {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 14px;
  background: rgba(179, 136, 255, 0.05);
  border: 1px solid rgba(179, 136, 255, 0.22);
  position: relative;
}
.header-time::before { content:''; position:absolute; top:-1px; left:-1px; width:6px; height:6px; border-top:1px solid var(--hud-purple); border-left:1px solid var(--hud-purple); }
.header-time::after  { content:''; position:absolute; bottom:-1px; right:-1px; width:6px; height:6px; border-bottom:1px solid var(--hud-purple); border-right:1px solid var(--hud-purple); }
.time-indicator {
  width: 5px; height: 5px;
  background: var(--hud-gold);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--hud-gold-glow);
  animation: hud-breathe 2s ease-in-out infinite;
}
.time-text {
  font-family: var(--hud-font-mono);
  font-size: 14px;
  color: var(--hud-text-purple);
  letter-spacing: 1px;
}
</style>
