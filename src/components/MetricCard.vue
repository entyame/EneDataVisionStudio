<template>
  <div class="hud-metric" :class="[`hud-metric--${color}`]">
    <!-- 左上角括号 -->
    <div class="metric-bracket tl"></div>
    <div class="metric-bracket tr"></div>

    <!-- 图标区 -->
    <div class="metric-icon-ring">
      <div class="metric-icon-inner">
        <span class="metric-icon" v-html="icon"></span>
      </div>
      <!-- 旋转环 -->
      <svg class="metric-ring" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="27" fill="none" :stroke="ringColor" stroke-width="1.5"
          stroke-dasharray="40 130" stroke-linecap="round" opacity="0.5" />
      </svg>
    </div>

    <!-- 信息 -->
    <div class="metric-info">
      <div class="metric-label">{{ label }}</div>
      <div class="metric-value">
        <span class="value-number">{{ displayValue }}</span>
        <span class="value-unit" v-if="unit">{{ unit }}</span>
      </div>
      <div class="metric-trend" v-if="trend !== undefined">
        <span :class="['trend-arrow', trend >= 0 ? 'up' : 'down']">
          {{ trend >= 0 ? '▲' : '▼' }}
        </span>
        <span class="trend-value">{{ Math.abs(trend).toFixed(1) }}%</span>
        <span class="trend-label">vs 昨日</span>
      </div>
    </div>

    <!-- 底部发光条 -->
    <div class="metric-glow-edge"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  unit?: string
  icon?: string
  color?: 'cyan' | 'gold' | 'jade' | 'purple'
  trend?: number
  format?: 'number' | 'short' | 'percent'
}>()

const ringColor = computed(() => {
  const map: Record<string, string> = { cyan: '#00e5ff', gold: '#ffd54f', jade: '#00ff88', purple: '#b388ff' }
  return map[props.color || 'cyan']
})

const displayValue = computed(() => {
  const v = props.value
  switch (props.format) {
    case 'short': return v >= 10000 ? (v / 10000).toFixed(1) + '万' : v.toLocaleString('zh-CN')
    case 'percent': return v.toFixed(1) + '%'
    default: return v.toLocaleString('zh-CN')
  }
})
</script>

<style scoped>
/* ========== 卡片容器 ========== */
.hud-metric {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(8, 12, 28, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 229, 255, 0.12);
  overflow: hidden;
  transition: all 0.3s ease;
}

.hud-metric:hover {
  border-color: rgba(0, 229, 255, 0.35);
  box-shadow: 0 0 25px rgba(0, 229, 255, 0.08), inset 0 0 25px rgba(0, 229, 255, 0.03);
  transform: translateY(-1px);
}

/* 左侧强调色条 */
.hud-metric::before {
  content: '';
  position: absolute;
  left: 0; top: 8px; bottom: 8px;
  width: 2px;
  border-radius: 0 2px 2px 0;
}

.hud-metric--cyan::before  { background: var(--hud-cyan); box-shadow: 0 0 8px var(--hud-cyan-glow); }
.hud-metric--gold::before  { background: var(--hud-gold); box-shadow: 0 0 8px var(--hud-gold-glow); }
.hud-metric--jade::before  { background: var(--hud-jade); box-shadow: 0 0 8px var(--hud-jade-glow); }
.hud-metric--purple::before{ background: var(--hud-purple); box-shadow: 0 0 8px var(--hud-purple-glow); }

/* 底部发光边 */
.metric-glow-edge {
  position: absolute;
  left: 10px; right: 10px; bottom: 0;
  height: 1px;
}
.hud-metric--cyan  .metric-glow-edge { background: linear-gradient(90deg, transparent, var(--hud-cyan-dim), transparent); }
.hud-metric--gold  .metric-glow-edge { background: linear-gradient(90deg, transparent, var(--hud-gold-dim), transparent); }
.hud-metric--jade  .metric-glow-edge { background: linear-gradient(90deg, transparent, var(--hud-jade-dim), transparent); }
.hud-metric--purple .metric-glow-edge { background: linear-gradient(90deg, transparent, var(--hud-purple-dim), transparent); }

/* 角括号 */
.metric-bracket {
  position: absolute;
  width: 10px; height: 10px;
  z-index: 1;
  pointer-events: none;
  opacity: 0.5;
}
.metric-bracket.tl { top: 2px; left: 2px; border-top: 1px solid; border-left: 1px solid; }
.metric-bracket.tr { top: 2px; right: 2px; border-top: 1px solid; border-right: 1px solid; }
.hud-metric--cyan  .metric-bracket { border-color: var(--hud-cyan); }
.hud-metric--gold  .metric-bracket { border-color: var(--hud-gold); }
.hud-metric--jade  .metric-bracket { border-color: var(--hud-jade); }
.hud-metric--purple .metric-bracket { border-color: var(--hud-purple); }

/* ========== 图标环 ========== */
.metric-icon-ring {
  position: relative;
  width: 50px; height: 50px;
  flex-shrink: 0;
}

.metric-ring {
  position: absolute;
  inset: -5px;
  width: 60px; height: 60px;
  animation: hud-orbit 8s linear infinite;
}

.metric-icon-inner {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 229, 255, 0.06);
  border: 1px solid rgba(0, 229, 255, 0.15);
}

.metric-icon {
  font-size: 22px;
  filter: drop-shadow(0 0 6px currentColor);
}

/* ========== 信息 ========== */
.metric-info { flex: 1; min-width: 0; }

.metric-label {
  font-family: var(--hud-font-body);
  font-size: 13px;
  color: var(--hud-text-secondary);
  margin-bottom: 2px;
  letter-spacing: 1.5px;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 2px;
}

.value-number {
  font-family: var(--hud-font-display);
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
  line-height: 1;
}

.hud-metric--cyan  .value-number { text-shadow: 0 0 15px var(--hud-cyan-dim); }
.hud-metric--gold  .value-number { text-shadow: 0 0 15px var(--hud-gold-dim); }
.hud-metric--jade  .value-number { text-shadow: 0 0 15px var(--hud-jade-dim); }
.hud-metric--purple .value-number { text-shadow: 0 0 15px var(--hud-purple-dim); }

.value-unit {
  font-size: 13px;
  color: var(--hud-text-secondary);
}

/* ========== 趋势 ========== */
.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-family: var(--hud-font-mono);
}

.trend-arrow.up   { color: var(--hud-jade); }
.trend-arrow.down { color: var(--hud-pink); }
.trend-value { color: var(--hud-text-secondary); font-weight: 600; }
.trend-label { color: var(--hud-text-dim); }
</style>
