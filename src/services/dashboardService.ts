/**
 * Dashboard 业务服务层
 *
 * 所有页面组件均通过此 service 获取数据，不直接接触 mock 或 API 细节。
 */
import type { DashboardData } from '@/types/dashboard'
import { fetchDashboardData } from './dataSource'
import { logger } from '@/logs/logger'

/**
 * 获取完整的大屏数据
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    logger.info('[DashboardService] Loading dashboard data...')
    const data = await fetchDashboardData()
    logger.info('[DashboardService] Dashboard data loaded successfully', {
      visits: data.summary.todayVisits,
      trendPoints: data.trend[0]?.data.length ?? 0,
      categories: data.categories.length,
      rankings: data.rankings.length,
      activities: data.activities.length,
    })
    return data
  } catch (error) {
    logger.error('[DashboardService] Failed to load dashboard data', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
