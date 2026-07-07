<template>
  <div class="metric-card" :class="[`metric-card--${color}`]">
    <div class="metric-icon">
      <span v-html="icon"></span>
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  unit?: string
  icon?: string
  color?: 'purple' | 'gold' | 'green' | 'cyan'
  trend?: number
  format?: 'number' | 'short' | 'percent'
}>()

const displayValue = computed(() => {
  const v = props.value
  switch (props.format) {
    case 'short':
      if (v >= 10000) return (v / 10000).toFixed(1) + '万'
      return v.toLocaleString('zh-CN')
    case 'percent':
      return v.toFixed(1) + '%'
    case 'number':
    default:
      return v.toLocaleString('zh-CN')
  }
})
</script>

<style scoped>
.metric-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  background: linear-gradient(135deg, rgba(50, 20, 80, 0.5) 0%, rgba(20, 5, 40, 0.7) 100%);
  border: 1px solid rgba(140, 100, 220, 0.25);
  border-radius: 4px;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.metric-card--purple::before {
  background: linear-gradient(180deg, #b388ff, #7c4dff);
}
.metric-card--gold::before {
  background: linear-gradient(180deg, #ffd54f, #ff8f00);
}
.metric-card--green::before {
  background: linear-gradient(180deg, #69f0ae, #00c853);
}
.metric-card--cyan::before {
  background: linear-gradient(180deg, #84ffff, #00bcd4);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(120, 60, 220, 0.3);
}

/* ---- 图标 ---- */
.metric-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border-radius: 8px;
  background: rgba(120, 80, 200, 0.2);
  flex-shrink: 0;
}

/* ---- 信息 ---- */
.metric-info {
  flex: 1;
  min-width: 0;
}

.metric-label {
  font-size: 14px;
  color: rgba(200, 180, 230, 0.85);
  margin-bottom: 3px;
  letter-spacing: 1px;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 3px;
}

.value-number {
  font-size: 34px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif;
  letter-spacing: 1px;
  line-height: 1;
}

.value-unit {
  font-size: 14px;
  color: rgba(200, 180, 230, 0.7);
}

/* ---- 趋势 ---- */
.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-arrow.up {
  color: #69f0ae;
}
.trend-arrow.down {
  color: #ff6e6e;
}

.trend-value {
  color: rgba(200, 180, 230, 0.9);
  font-weight: 600;
}

.trend-label {
  color: rgba(200, 180, 230, 0.5);
}
</style>
