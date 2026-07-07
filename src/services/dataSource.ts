/**
 * 数据源策略 — 根据 VITE_DATA_SOURCE 环境变量切换数据获取方式
 *
 * - mock: 通过 MSW 拦截请求，使用 mock 数据
 * - api:  通过 Axios 请求真实 API（当前预留接口）
 */
import type { DashboardData, SummaryMetrics } from '@/types/dashboard'
import http from './http'
import { getDashboardMockData } from '@/mocks/dashboardMock'
import { logger } from '@/logs/logger'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock'

/**
 * 获取 Dashboard 完整数据
 *
 * mock 模式下直接读取本地 mock 数据（配合 MSW）
 * api 模式下通过 Axios 发起 HTTP 请求
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  logger.info(`[DataSource] Fetching dashboard data, source: ${DATA_SOURCE}`)

  if (DATA_SOURCE === 'mock') {
    // Mock 模式：直接返回本地数据，MSW 会拦截请求，这里用直接调用提高效率
    return getDashboardMockData()
  }

  // API 模式：通过 Axios 请求真实后端
  const response = await http.get<ApiResponse<DashboardData>>('/api/v1/dashboard')
  return response.data.data
}

/**
 * 获取汇总指标
 */
export async function fetchSummaryMetrics(): Promise<SummaryMetrics> {
  logger.info(`[DataSource] Fetching summary metrics, source: ${DATA_SOURCE}`)

  if (DATA_SOURCE === 'mock') {
    return getDashboardMockData().summary
  }

  const response = await http.get<ApiResponse<SummaryMetrics>>('/api/v1/dashboard/summary')
  return response.data.data
}
