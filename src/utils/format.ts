/**
 * 格式化工具函数
 */

/**
 * 格式化数字为千分位字符串
 * @example formatNumber(12345) => "12,345"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN')
}

/**
 * 格式化数字为短格式（万、亿）
 * @example formatShortNumber(12345) => "1.23万"
 */
export function formatShortNumber(value: number): string {
  if (value >= 100_000_000) {
    return (value / 100_000_000).toFixed(2) + '亿'
  }
  if (value >= 10_000) {
    return (value / 10_000).toFixed(2) + '万'
  }
  return value.toLocaleString('zh-CN')
}

/**
 * 格式化百分比
 * @example formatPercent(0.9523) => "95.23%"
 */
export function formatPercent(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%'
}

/**
 * 格式化时间戳为可读时间
 */
export function formatTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * 格式化毫秒为耗时字符串
 * @example formatDuration(3661000) => "1h 1m 1s"
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  if (s > 0 || parts.length === 0) parts.push(`${s}s`)
  return parts.join(' ')
}
