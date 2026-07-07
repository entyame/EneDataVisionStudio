<template>
  <div class="screen-header">
    <div class="header-left">
      <div class="header-deco-line"></div>
      <div class="header-deco-diamond"></div>
    </div>
    <div class="header-center">
      <h1 class="header-title">{{ title }}</h1>
      <p class="header-subtitle">{{ subtitle }}</p>
    </div>
    <div class="header-right">
      <div class="header-deco-diamond"></div>
      <div class="header-deco-line"></div>
      <div class="header-time">
        <span class="time-text">{{ currentTime }}</span>
      </div>
    </div>
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
  currentTime.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 40px;
  background: linear-gradient(180deg, rgba(40, 15, 60, 0.9) 0%, rgba(20, 5, 35, 0.6) 100%);
  border-bottom: 1px solid rgba(140, 100, 220, 0.3);
  position: relative;
  overflow: hidden;
}

.screen-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 160, 255, 0.6), transparent);
}

/* ---- 左侧装饰 ---- */
.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header-deco-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 160, 255, 0.5));
}

.header-right .header-deco-line {
  background: linear-gradient(90deg, rgba(200, 160, 255, 0.5), transparent);
}

.header-deco-diamond {
  width: 8px;
  height: 8px;
  background: #c0a0ff;
  transform: rotate(45deg);
  box-shadow: 0 0 8px rgba(192, 160, 255, 0.6);
}

/* ---- 标题 ---- */
.header-center {
  text-align: center;
  flex: 1;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 6px;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, #c0a0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 12px;
  color: rgba(180, 150, 220, 0.7);
  margin: 2px 0 0;
  letter-spacing: 3px;
}

/* ---- 时间 ---- */
.header-time {
  padding: 4px 14px;
  background: rgba(100, 60, 180, 0.25);
  border: 1px solid rgba(140, 100, 220, 0.3);
  border-radius: 4px;
}

.time-text {
  font-size: 13px;
  color: #d0c0f0;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}
</style>
