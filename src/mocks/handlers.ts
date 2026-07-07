/**
 * MSW (Mock Service Worker) 请求处理器
 * 拦截 API 请求并返回 mock 数据
 */
import { http, HttpResponse, delay } from 'msw'
import { getDashboardMockData } from './dashboardMock'
import { logger } from '@/logs/logger'

const API_BASE = '/api/v1'

export const handlers = [
  /**
   * GET /api/v1/dashboard — 获取大屏完整数据
   */
  http.get(`${API_BASE}/dashboard`, async () => {
    logger.debug('[MSW] Intercepted GET /api/v1/dashboard')

    // 模拟网络延迟 200–600ms
    await delay(200 + Math.random() * 400)

    const data = getDashboardMockData()
    logger.info('[MSW] Returning mock dashboard data', {
      visits: data.summary.todayVisits,
      orders: data.summary.realtimeOrders,
    })

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data,
      timestamp: Date.now(),
    })
  }),

  /**
   * GET /api/v1/dashboard/summary — 获取汇总指标
   */
  http.get(`${API_BASE}/dashboard/summary`, async () => {
    logger.debug('[MSW] Intercepted GET /api/v1/dashboard/summary')
    await delay(100 + Math.random() * 200)

    const data = getDashboardMockData()
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: data.summary,
    })
  }),
]
