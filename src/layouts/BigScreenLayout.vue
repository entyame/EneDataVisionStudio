<template>
  <div class="big-screen-layout">
    <!-- 顶部标题 -->
    <ScreenHeader
      title="EneDataVisionStudio"
      subtitle="Ene数据视觉工作室 · 数据可视化平台"
    />

    <!-- 主内容区 -->
    <div class="screen-main">
      <!-- 左侧面板区 -->
      <div class="screen-left">
        <div class="chart-box">
          <LineTrendChart :data="trend" />
        </div>
        <div class="chart-box">
          <PieStatusChart :data="categories" />
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="screen-center">
        <!-- 顶部指标卡片 -->
        <div class="metrics-row" v-if="summary">
          <MetricCard
            label="今日访问量"
            :value="summary.todayVisits"
            unit="次"
            icon="👁"
            color="purple"
            format="number"
            :trend="12.5"
          />
          <MetricCard
            label="实时订单数"
            :value="summary.realtimeOrders"
            unit="单"
            icon="📦"
            color="gold"
            format="number"
            :trend="8.3"
          />
          <MetricCard
            label="活跃用户数"
            :value="summary.activeUsers"
            unit="人"
            icon="👤"
            color="green"
            format="number"
            :trend="-3.2"
          />
          <MetricCard
            label="系统健康度"
            :value="summary.systemHealth"
            unit="%"
            icon="💚"
            color="cyan"
            format="percent"
            :trend="0.8"
          />
        </div>

        <!-- 地图总览 -->
        <div class="chart-box chart-box--center">
          <MapOverviewChart :data="mapPoints" />
        </div>

        <!-- 底部实时动态 -->
        <div class="activity-box">
          <BasePanel title="实时动态">
            <div class="activity-list">
              <div
                v-for="item in activities"
                :key="item.id"
                class="activity-item"
                :class="`activity--${item.type}`"
              >
                <span class="activity-dot"></span>
                <span class="activity-time">{{ item.time }}</span>
                <span class="activity-content">{{ item.content }}</span>
              </div>
            </div>
          </BasePanel>
        </div>
      </div>

      <!-- 右侧面板区 -->
      <div class="screen-right">
        <div class="chart-box">
          <BarRankingChart :data="rankings" />
        </div>
        <div class="chart-box">
          <RadarAbilityChart
            :indicators="radarIndicators"
            :series="radarSeries"
          />
        </div>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <div class="loading-overlay" v-if="loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">数据加载中...</span>
    </div>

    <!-- 错误提示 -->
    <div class="error-overlay" v-if="error" @click="retry">
      <span class="error-text">{{ error }}</span>
      <button class="error-retry-btn">点击重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboardStore'
import ScreenHeader from '@/components/ScreenHeader.vue'
import MetricCard from '@/components/MetricCard.vue'
import BasePanel from '@/components/BasePanel.vue'
import LineTrendChart from '@/charts/LineTrendChart.vue'
import BarRankingChart from '@/charts/BarRankingChart.vue'
import PieStatusChart from '@/charts/PieStatusChart.vue'
import RadarAbilityChart from '@/charts/RadarAbilityChart.vue'
import MapOverviewChart from '@/charts/MapOverviewChart.vue'

const store = useDashboardStore()
const {
  loading,
  error,
  summary,
  trend,
  categories,
  rankings,
  radarIndicators,
  radarSeries,
  activities,
  mapPoints,
} = storeToRefs(store)

onMounted(() => {
  store.loadDashboardData()
})

function retry(): void {
  store.loadDashboardData()
}
</script>

<style scoped>
.big-screen-layout {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 50% 50%, #1a0a30 0%, #0a0518 60%, #040210 100%);
  color: #e0d0ff;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', sans-serif;
  overflow: hidden;
}

/* ---- 主内容 ---- */
.screen-main {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 10px 16px 12px;
  overflow: hidden;
}

/* ---- 左/右 列 ---- */
.screen-left,
.screen-right {
  width: 470px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.screen-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

/* ---- 图表容器 ---- */
.chart-box {
  flex: 1;
  min-height: 0;
}

.chart-box--center {
  flex: 2;
}

/* ---- 指标卡片行 ---- */
.metrics-row {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.metrics-row > * {
  flex: 1;
}

/* ---- 实时动态 ---- */
.activity-box {
  flex-shrink: 0;
  height: 200px;
}

.activity-list {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  font-size: 13px;
  border-radius: 2px;
  background: rgba(60, 30, 100, 0.15);
  transition: background 0.2s;
}

.activity-item:hover {
  background: rgba(60, 30, 100, 0.3);
}

.activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity--success .activity-dot {
  background: #69f0ae;
  box-shadow: 0 0 6px #69f0ae;
}
.activity--info .activity-dot {
  background: #40c4ff;
  box-shadow: 0 0 6px #40c4ff;
}
.activity--warning .activity-dot {
  background: #ffd54f;
  box-shadow: 0 0 6px #ffd54f;
}
.activity--error .activity-dot {
  background: #ff6e6e;
  box-shadow: 0 0 6px #ff6e6e;
}

.activity-time {
  color: rgba(180, 150, 220, 0.6);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  flex-shrink: 0;
}

.activity-content {
  color: rgba(210, 195, 235, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- 加载遮罩 ---- */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(5, 2, 16, 0.85);
  z-index: 100;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(140, 100, 220, 0.3);
  border-top-color: #c0a0ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #c0a0ff;
  font-size: 16px;
  letter-spacing: 2px;
}

/* ---- 错误遮罩 ---- */
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(5, 2, 16, 0.9);
  z-index: 100;
  gap: 16px;
  cursor: pointer;
}

.error-text {
  color: #ff6e6e;
  font-size: 18px;
}

.error-retry-btn {
  padding: 8px 24px;
  background: rgba(120, 80, 200, 0.3);
  border: 1px solid rgba(140, 100, 220, 0.5);
  color: #e0d0ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.error-retry-btn:hover {
  background: rgba(120, 80, 200, 0.5);
}
</style>
