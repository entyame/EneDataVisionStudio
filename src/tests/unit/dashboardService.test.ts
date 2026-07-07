/**
 * DashboardService — 单元测试
 *
 * 验证 mock 模式下能正确返回数据。
 */
import { describe, it, expect, vi, beforeAll } from 'vitest'

// 强制设置 mock 模式
vi.stubEnv('VITE_DATA_SOURCE', 'mock')

import { getDashboardData } from '@/services/dashboardService'

describe('dashboardService', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_DATA_SOURCE', 'mock')
  })

  it('should return dashboard data in mock mode', async () => {
    const data = await getDashboardData()

    // 验证数据结构完整
    expect(data).toBeDefined()
    expect(data.summary).toBeDefined()
    expect(data.trend).toBeDefined()
    expect(data.categories).toBeDefined()
    expect(data.rankings).toBeDefined()
    expect(data.radarIndicators).toBeDefined()
    expect(data.radarSeries).toBeDefined()
    expect(data.activities).toBeDefined()
    expect(data.mapPoints).toBeDefined()
  })

  it('should return valid summary metrics', async () => {
    const data = await getDashboardData()

    expect(data.summary.todayVisits).toBeGreaterThan(100000)
    expect(data.summary.realtimeOrders).toBeGreaterThan(3000)
    expect(data.summary.activeUsers).toBeGreaterThan(8000)
    expect(data.summary.systemHealth).toBeGreaterThan(90)
    expect(data.summary.systemHealth).toBeLessThanOrEqual(100)
  })

  it('should return 24 trend data points', async () => {
    const data = await getDashboardData()

    expect(data.trend.length).toBe(2)
    expect(data.trend[0].data.length).toBe(24)
    expect(data.trend[1].data.length).toBe(24)
  })

  it('should return 5 categories', async () => {
    const data = await getDashboardData()
    expect(data.categories.length).toBe(5)
  })

  it('should return 10 city rankings', async () => {
    const data = await getDashboardData()
    expect(data.rankings.length).toBe(10)
  })

  it('should return radar data with 6 dimensions', async () => {
    const data = await getDashboardData()
    expect(data.radarIndicators.length).toBe(6)
    expect(data.radarSeries.length).toBe(2)
  })

  it('should return 8 activity items', async () => {
    const data = await getDashboardData()
    expect(data.activities.length).toBe(8)
  })

  it('should return 15 map points', async () => {
    const data = await getDashboardData()
    expect(data.mapPoints.length).toBe(15)
  })
})
