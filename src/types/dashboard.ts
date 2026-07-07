/** 核心指标数据 */
export interface SummaryMetrics {
  todayVisits: number
  realtimeOrders: number
  activeUsers: number
  systemHealth: number
}

/** 趋势数据点 */
export interface TrendPoint {
  time: string
  value: number
}

/** 趋势系列 */
export interface TrendSeries {
  name: string
  data: TrendPoint[]
}

/** 分类占比数据 */
export interface CategoryItem {
  name: string
  value: number
}

/** 排名数据 */
export interface RankItem {
  name: string
  value: number
}

/** 雷达指标 */
export interface RadarIndicator {
  name: string
  max: number
}

/** 雷达数据 */
export interface RadarSeries {
  name: string
  data: number[]
}

/** 活动/告警条目 */
export interface ActivityItem {
  id: number
  type: 'info' | 'warning' | 'error' | 'success'
  content: string
  time: string
}

/** 地图散点数据 */
export interface MapPoint {
  name: string
  value: [number, number, number] // [lng, lat, value]
}

/** Dashboard 完整数据 */
export interface DashboardData {
  summary: SummaryMetrics
  trend: TrendSeries[]
  categories: CategoryItem[]
  rankings: RankItem[]
  radarIndicators: RadarIndicator[]
  radarSeries: RadarSeries[]
  activities: ActivityItem[]
  mapPoints: MapPoint[]
}
