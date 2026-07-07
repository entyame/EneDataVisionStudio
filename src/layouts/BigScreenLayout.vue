<template>
  <div class="hud-cockpit">
    <!-- Canvas 粒子背景 -->
    <ParticleBackground />

    <!-- 网格背景叠加 -->
    <div class="hud-grid-overlay"></div>

    <!-- 顶部标题 -->
    <ScreenHeader
      title="EneDataVisionStudio"
      subtitle="Ene数据视觉工作室 · 智能数据驾驶舱"
    />

    <!-- 主内容区 -->
    <div class="cockpit-main">
      <!-- 左侧面板区 -->
      <div class="cockpit-left">
        <div class="chart-slot">
          <LineTrendChart :data="trend" />
        </div>
        <div class="chart-slot">
          <PieStatusChart :data="categories" />
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="cockpit-center">
        <!-- 指标卡片行 -->
        <div class="metrics-row" v-if="summary">
          <MetricCard label="今日访问量" :value="summary.todayVisits" unit="次" icon="◈" color="purple" format="number" :trend="12.5" />
          <MetricCard label="实时订单数" :value="summary.realtimeOrders" unit="单" icon="◆" color="gold" format="number" :trend="8.3" />
          <MetricCard label="活跃用户数" :value="summary.activeUsers" unit="人" icon="◇" color="purple" format="number" :trend="-3.2" />
          <MetricCard label="系统健康度" :value="summary.systemHealth" unit="%" icon="◎" color="gold" format="percent" :trend="0.8" />
        </div>

        <!-- 地图总览 -->
        <div class="chart-slot chart-slot--map">
          <MapOverviewChart :data="mapPoints" />
        </div>

        <!-- 实时动态 -->
        <div class="activity-slot">
          <BasePanel title="实时动态" accent="cyan">
            <div class="activity-list">
              <div
                v-for="item in activities"
                :key="item.id"
                class="activity-item"
                :class="`activity--${item.type}`"
              >
                <span class="act-dot"></span>
                <span class="act-time">{{ item.time }}</span>
                <span class="act-content">{{ item.content }}</span>
              </div>
            </div>
          </BasePanel>
        </div>
      </div>

      <!-- 右侧面板区 -->
      <div class="cockpit-right">
        <div class="chart-slot">
          <BarRankingChart :data="rankings" />
        </div>
        <div class="chart-slot">
          <RadarAbilityChart :indicators="radarIndicators" :series="radarSeries" />
        </div>
      </div>
    </div>

    <!-- 加载 & 错误遮罩 -->
    <div class="hud-overlay" v-if="loading">
      <div class="hud-loader"></div>
      <span class="hud-loading-text">SYS.INIT // 数据加载中...</span>
    </div>

    <div class="hud-overlay" v-if="error" @click="retry">
      <span class="hud-error-text">ERR: {{ error }}</span>
      <button class="hud-retry-btn">⟳ RETRY</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboardStore'
import ParticleBackground from '@/components/ParticleBackground.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import MetricCard from '@/components/MetricCard.vue'
import BasePanel from '@/components/BasePanel.vue'
import LineTrendChart from '@/charts/LineTrendChart.vue'
import BarRankingChart from '@/charts/BarRankingChart.vue'
import PieStatusChart from '@/charts/PieStatusChart.vue'
import RadarAbilityChart from '@/charts/RadarAbilityChart.vue'
import MapOverviewChart from '@/charts/MapOverviewChart.vue'

const store = useDashboardStore()
const { loading, error, summary, trend, categories, rankings, radarIndicators, radarSeries, activities, mapPoints } = storeToRefs(store)

onMounted(() => store.loadDashboardData())
function retry() { store.loadDashboardData() }
</script>

<style scoped>
/* ========== 驾驶舱容器 ========== */
.hud-cockpit {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 50% 30%, #140820 0%, #0a0618 45%, #05030f 100%);
  color: var(--hud-text-primary);
  font-family: var(--hud-font-body);
  overflow: hidden;
  position: relative;
}

/* ========== 网格叠加 ========== */
.hud-grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image:
    linear-gradient(rgba(179, 136, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(179, 136, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 50% 30%, black 40%, transparent 70%);
}

/* ========== 主内容 ========== */
.cockpit-main {
  flex: 1;
  display: flex;
  gap: 10px;
  padding: 8px 14px 10px;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* ---- 左/右列 ---- */
.cockpit-left,
.cockpit-right {
  width: 470px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cockpit-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

/* ---- 图表槽位 ---- */
.chart-slot {
  flex: 1;
  min-height: 0;
}

.chart-slot--map {
  flex: 3;
}

/* ---- 指标卡片行 ---- */
.metrics-row {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.metrics-row > * {
  flex: 1;
}

/* ---- 实时动态 ---- */
.activity-slot {
  flex-shrink: 0;
  height: 250px;
}

.activity-list {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  font-size: 15px;
  font-family: var(--hud-font-body);
  background: rgba(179, 136, 255, 0.04);
  border-left: 2px solid transparent;
  transition: all 0.3s;
}

.activity-item:hover {
  background: rgba(179, 136, 255, 0.1);
}

.activity--success { border-left-color: var(--hud-jade); }
.activity--info    { border-left-color: var(--hud-purple); }
.activity--warning { border-left-color: var(--hud-gold); }
.activity--error   { border-left-color: var(--hud-pink); }

.act-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}
.activity--success .act-dot { background: var(--hud-jade); box-shadow: 0 0 6px var(--hud-jade-dim); }
.activity--info    .act-dot { background: var(--hud-purple); box-shadow: 0 0 6px var(--hud-purple-glow); }
.activity--warning .act-dot { background: var(--hud-gold); box-shadow: 0 0 6px var(--hud-gold-glow); }
.activity--error   .act-dot { background: var(--hud-pink); box-shadow: 0 0 6px var(--hud-pink-dim); }

.act-time {
  font-family: var(--hud-font-mono);
  font-size: 13px;
  color: var(--hud-text-dim);
  flex-shrink: 0;
}

.act-content {
  color: var(--hud-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 加载遮罩 ========== */
.hud-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(4, 5, 16, 0.9);
  z-index: 100;
  gap: 20px;
  backdrop-filter: blur(4px);
}

.hud-loader {
  width: 48px; height: 48px;
  border: 2px solid rgba(0, 229, 255, 0.15);
  border-top-color: var(--hud-cyan);
  border-radius: 50%;
  animation: hud-orbit 1s linear infinite;
}

@keyframes hud-orbit {
  to { transform: rotate(360deg); }
}

.hud-loading-text {
  font-family: var(--hud-font-mono);
  font-size: 15px;
  color: var(--hud-cyan);
  letter-spacing: 3px;
  animation: hud-breathe 2s ease-in-out infinite;
}

.hud-error-text {
  font-family: var(--hud-font-mono);
  font-size: 16px;
  color: var(--hud-pink);
}

.hud-retry-btn {
  padding: 10px 28px;
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: var(--hud-cyan);
  font-family: var(--hud-font-mono);
  font-size: 14px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
}
.hud-retry-btn:hover {
  background: rgba(0, 229, 255, 0.15);
  box-shadow: 0 0 20px var(--hud-cyan-dim);
}
</style>
