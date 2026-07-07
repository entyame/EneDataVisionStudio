/**
 * Mock 数据生成器 — 为 Dashboard 提供完整的 mock 数据集
 */
import type {
  DashboardData,
  SummaryMetrics,
  TrendSeries,
  CategoryItem,
  RankItem,
  RadarIndicator,
  RadarSeries,
  ActivityItem,
  MapPoint,
} from '@/types/dashboard'

/** 生成汇总指标 mock 数据 */
export function generateSummaryMetrics(): SummaryMetrics {
  return {
    todayVisits: 128000 + Math.floor(Math.random() * 20000),
    realtimeOrders: 3456 + Math.floor(Math.random() * 500),
    activeUsers: 8920 + Math.floor(Math.random() * 1000),
    systemHealth: 95 + Math.random() * 5,
  }
}

/** 生成访问趋势 mock 数据（过去24小时） */
export function generateTrendData(): TrendSeries[] {
  const now = new Date()
  const visits: TrendSeries = { name: '访问量', data: [] }
  const orders: TrendSeries = { name: '订单量', data: [] }

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const timeStr = `${String(time.getHours()).padStart(2, '0')}:00`
    visits.data.push({
      time: timeStr,
      value: 2000 + Math.floor(Math.random() * 8000),
    })
    orders.data.push({
      time: timeStr,
      value: 100 + Math.floor(Math.random() * 400),
    })
  }

  return [visits, orders]
}

/** 生成分类占比 mock 数据 */
export function generateCategoryData(): CategoryItem[] {
  return [
    { name: '数据服务', value: 35 },
    { name: '云计算', value: 28 },
    { name: '人工智能', value: 20 },
    { name: '物联网', value: 12 },
    { name: '其他', value: 5 },
  ]
}

/** 生成城市排名 mock 数据 */
export function generateRankingData(): RankItem[] {
  return [
    { name: '北京', value: 9845 },
    { name: '上海', value: 9210 },
    { name: '深圳', value: 8765 },
    { name: '广州', value: 8120 },
    { name: '杭州', value: 7650 },
    { name: '成都', value: 6980 },
    { name: '南京', value: 6320 },
    { name: '武汉', value: 5890 },
    { name: '西安', value: 5210 },
    { name: '重庆', value: 4870 },
  ]
}

/** 生成雷达图指标维度 */
export function generateRadarIndicators(): RadarIndicator[] {
  return [
    { name: '性能', max: 100 },
    { name: '安全', max: 100 },
    { name: '稳定', max: 100 },
    { name: '体验', max: 100 },
    { name: '效率', max: 100 },
    { name: '扩展', max: 100 },
  ]
}

/** 生成雷达图数据 */
export function generateRadarSeries(): RadarSeries[] {
  return [
    { name: '当前系统', data: [88, 76, 92, 85, 79, 82] },
    { name: '行业均值', data: [72, 68, 75, 70, 65, 71] },
  ]
}

/** 生成实时动态/告警 mock 数据 */
export function generateActivities(): ActivityItem[] {
  const templates = [
    { type: 'success' as const, content: '订单 #ORD-{id} 已完成支付，金额 ¥{amount}' },
    { type: 'info' as const, content: '用户 {name} 登录了管理后台' },
    { type: 'warning' as const, content: '服务器 {server} CPU 使用率达到 {pct}%' },
    { type: 'error' as const, content: 'API 接口 /api/v2/query 响应超时，耗时 {ms}ms' },
    { type: 'success' as const, content: '数据同步任务完成，共同步 {count} 条记录' },
    { type: 'info' as const, content: '新用户 {name} 完成注册' },
    { type: 'warning' as const, content: '磁盘空间不足，剩余 {pct}%' },
    { type: 'success' as const, content: '系统备份完成，耗时 {ms}ms' },
  ]

  const names = ['张三', '李四', '王五', '赵六', '陈七']
  const servers = ['Srv-01', 'Srv-02', 'Srv-03']

  return templates.slice(0, 8).map((tpl, i) => {
    let content = tpl.content
      .replace('{id}', String(10000 + i))
      .replace('{amount}', String(100 + Math.floor(Math.random() * 9000)))
      .replace('{name}', names[i % names.length])
      .replace('{server}', servers[i % servers.length])
      .replace('{pct}', String(70 + Math.floor(Math.random() * 25)))
      .replace('{ms}', String(500 + Math.floor(Math.random() * 3000)))
      .replace('{count}', String(1000 + Math.floor(Math.random() * 9000)))

    const now = new Date()
    const time = new Date(now.getTime() - i * 5 * 60 * 1000)

    return {
      id: i + 1,
      type: tpl.type,
      content,
      time: `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`,
    }
  })
}

/** 生成地图散点 mock 数据 */
export function generateMapPoints(): MapPoint[] {
  return [
    { name: '北京', value: [116.46, 39.92, 9845] },
    { name: '上海', value: [121.48, 31.22, 9210] },
    { name: '深圳', value: [114.07, 22.62, 8765] },
    { name: '广州', value: [113.23, 23.16, 8120] },
    { name: '杭州', value: [120.19, 30.26, 7650] },
    { name: '成都', value: [104.06, 30.67, 6980] },
    { name: '南京', value: [118.78, 32.04, 6320] },
    { name: '武汉', value: [114.31, 30.52, 5890] },
    { name: '西安', value: [108.95, 34.27, 5210] },
    { name: '重庆', value: [106.54, 29.59, 4870] },
    { name: '长沙', value: [112.98, 28.19, 4120] },
    { name: '郑州', value: [113.65, 34.76, 3890] },
    { name: '济南', value: [117.0, 36.65, 3650] },
    { name: '天津', value: [117.2, 39.13, 3420] },
    { name: '苏州', value: [120.62, 31.32, 3100] },
  ]
}

/**
 * 获取完整的 Dashboard mock 数据
 */
export function getDashboardMockData(): DashboardData {
  return {
    summary: generateSummaryMetrics(),
    trend: generateTrendData(),
    categories: generateCategoryData(),
    rankings: generateRankingData(),
    radarIndicators: generateRadarIndicators(),
    radarSeries: generateRadarSeries(),
    activities: generateActivities(),
    mapPoints: generateMapPoints(),
  }
}
