/**
 * Dashboard Pinia Store — 管理大屏全局状态
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DashboardData, SummaryMetrics, TrendSeries, CategoryItem, RankItem, RadarIndicator, RadarSeries, ActivityItem, MapPoint } from '@/types/dashboard'
import { getDashboardData } from '@/services/dashboardService'
import { logger } from '@/logs/logger'

export const useDashboardStore = defineStore('dashboard', () => {
  // ---- 状态 ----
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dashboardData = ref<DashboardData | null>(null)
  const lastUpdated = ref<string>('')

  // ---- 计算属性 ----
  const summary = computed<SummaryMetrics | null>(() => dashboardData.value?.summary ?? null)
  const trend = computed<TrendSeries[]>(() => dashboardData.value?.trend ?? [])
  const categories = computed<CategoryItem[]>(() => dashboardData.value?.categories ?? [])
  const rankings = computed<RankItem[]>(() => dashboardData.value?.rankings ?? [])
  const radarIndicators = computed<RadarIndicator[]>(() => dashboardData.value?.radarIndicators ?? [])
  const radarSeries = computed<RadarSeries[]>(() => dashboardData.value?.radarSeries ?? [])
  const activities = computed<ActivityItem[]>(() => dashboardData.value?.activities ?? [])
  const mapPoints = computed<MapPoint[]>(() => dashboardData.value?.mapPoints ?? [])

  // ---- 操作 ----
  async function loadDashboardData(): Promise<void> {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      logger.info('[DashboardStore] Loading dashboard data...')
      dashboardData.value = await getDashboardData()
      lastUpdated.value = new Date().toISOString()
      logger.info('[DashboardStore] Dashboard data loaded successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error loading dashboard data'
      error.value = message
      logger.error('[DashboardStore] Failed to load dashboard data', { error: message })
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新数据（可绑定定时器调用）
   */
  async function refresh(): Promise<void> {
    logger.info('[DashboardStore] Refreshing dashboard data...')
    await loadDashboardData()
  }

  return {
    // 状态
    loading,
    error,
    dashboardData,
    lastUpdated,
    // 计算属性
    summary,
    trend,
    categories,
    rankings,
    radarIndicators,
    radarSeries,
    activities,
    mapPoints,
    // 操作
    loadDashboardData,
    refresh,
  }
})
