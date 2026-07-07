<template>
  <div class="hud-metric" :class="[`hud-metric--${color}`]">
    <div class="metric-bracket tl"></div>
    <div class="metric-bracket tr"></div>

    <div class="metric-icon-ring">
      <div class="metric-icon-inner">
        <img class="metric-icon" :src="icon" alt="" />
      </div>
      <svg class="metric-ring" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="27" fill="none" :stroke="ringColor" stroke-width="1.5"
          stroke-dasharray="40 130" stroke-linecap="round" opacity="0.45" />
      </svg>
    </div>

    <div class="metric-info">
      <div class="metric-label">{{ label }}</div>
      <div class="metric-value">
        <span class="value-number">{{ displayValue }}</span>
        <span class="value-unit" v-if="unit">{{ unit }}</span>
      </div>
      <div class="metric-trend" v-if="trend !== undefined">
        <span :class="['trend-arrow', trend >= 0 ? 'up' : 'down']">{{ trend >= 0 ? '▲' : '▼' }}</span>
        <span class="trend-value">{{ Math.abs(trend).toFixed(1) }}%</span>
        <span class="trend-label">vs 昨日</span>
      </div>
    </div>

    <div class="metric-glow-edge"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string; value: number; unit?: string; icon?: string
  color?: 'purple' | 'gold'
  trend?: number; format?: 'number' | 'short' | 'percent'
}>()

const ringColor = computed(() => props.color === 'gold' ? '#ffd54f' : '#b388ff')

const displayValue = computed(() => {
  const v = props.value
  switch (props.format) {
    case 'short': return v >= 10000 ? (v/10000).toFixed(1)+'万' : v.toLocaleString('zh-CN')
    case 'percent': return v.toFixed(1)+'%'
    default: return v.toLocaleString('zh-CN')
  }
})
</script>

<style scoped>
.hud-metric {
  position: relative;
  display: flex; align-items: center; gap: 14px;
  padding: 16px 22px;
  background: rgba(10, 6, 22, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(179, 136, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s;
}
.hud-metric:hover {
  border-color: rgba(179, 136, 255, 0.4);
  box-shadow: 0 0 20px rgba(179, 136, 255, 0.08);
  transform: translateY(-1px);
}

/* 左侧色条 */
.hud-metric::before {
  content: ''; position: absolute;
  left: 0; top: 10px; bottom: 10px; width: 2px;
  border-radius: 0 2px 2px 0;
}
.hud-metric--purple::before { background: var(--hud-purple); box-shadow: 0 0 8px var(--hud-purple-glow); }
.hud-metric--gold::before   { background: var(--hud-gold);   box-shadow: 0 0 8px var(--hud-gold-glow); }

/* 底部发光 */
.metric-glow-edge {
  position: absolute; left: 10px; right: 10px; bottom: 0; height: 1px;
}
.hud-metric--purple .metric-glow-edge { background: linear-gradient(90deg, transparent, var(--hud-purple-dim), transparent); }
.hud-metric--gold   .metric-glow-edge { background: linear-gradient(90deg, transparent, var(--hud-gold-dim), transparent); }

/* 角括号 */
.metric-bracket {
  position: absolute; width: 10px; height: 10px;
  z-index: 1; pointer-events: none; opacity: 0.45;
}
.metric-bracket.tl { top: 2px; left: 2px; border-top: 1px solid; border-left: 1px solid; }
.metric-bracket.tr { top: 2px; right: 2px; border-top: 1px solid; border-right: 1px solid; }
.hud-metric--purple .metric-bracket { border-color: var(--hud-purple); }
.hud-metric--gold   .metric-bracket { border-color: var(--hud-gold); }

/* 图标环 */
.metric-icon-ring { position: relative; width: 54px; height: 54px; flex-shrink: 0; }
.metric-ring { position: absolute; inset: -6px; width: 66px; height: 66px; animation: hud-orbit 10s linear infinite; }
.metric-icon-inner {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(179, 136, 255, 0.06);
  border: 1px solid rgba(179, 136, 255, 0.18);
}
.metric-icon { width: 26px; height: 26px; display: block; filter: brightness(0) invert(1); }

/* 信息 */
.metric-info { flex: 1; min-width: 0; }
.metric-label {
  font-family: var(--hud-font-body);
  font-size: 15px;
  color: var(--hud-text-secondary);
  margin-bottom: 2px;
  letter-spacing: 2px;
}
.metric-value { display: flex; align-items: baseline; gap: 6px; margin-bottom: 2px; }
.value-number {
  font-family: var(--hud-font-display);
  font-size: 36px; font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px; line-height: 1;
}
.hud-metric--purple .value-number { text-shadow: 0 0 16px var(--hud-purple-dim); }
.hud-metric--gold   .value-number { text-shadow: 0 0 16px var(--hud-gold-dim); }
.value-unit { font-size: 14px; color: var(--hud-text-secondary); }

/* 趋势 */
.metric-trend { display: flex; align-items: center; gap: 4px; font-size: 12px; font-family: var(--hud-font-mono); }
.trend-arrow.up   { color: var(--hud-jade); }
.trend-arrow.down { color: var(--hud-pink); }
.trend-value { color: var(--hud-text-secondary); font-weight: 600; }
.trend-label { color: var(--hud-text-dim); }
</style>
