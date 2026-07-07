/**
 * 格式化工具函数 — 单元测试
 */
import { describe, it, expect } from 'vitest'
import { formatNumber, formatShortNumber, formatPercent, formatTime, formatDuration } from '@/utils/format'

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(123)).toBe('123')
    expect(formatNumber(12345)).toBe('12,345')
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
})

describe('formatShortNumber', () => {
  it('should format small numbers normally', () => {
    expect(formatShortNumber(0)).toBe('0')
    expect(formatShortNumber(9999)).toBe('9,999')
  })

  it('should format numbers >= 10000 in wan', () => {
    expect(formatShortNumber(10000)).toBe('1.00万')
    expect(formatShortNumber(12345)).toBe('1.23万')
    expect(formatShortNumber(9999000)).toBe('999.90万')
  })

  it('should format numbers >= 100M in yi', () => {
    expect(formatShortNumber(100_000_000)).toBe('1.00亿')
  })
})

describe('formatPercent', () => {
  it('should format decimal as percentage', () => {
    expect(formatPercent(0.9523)).toBe('95.23%')
    expect(formatPercent(0.5)).toBe('50.00%')
    expect(formatPercent(1)).toBe('100.00%')
    expect(formatPercent(0, 0)).toBe('0%')
  })
})

describe('formatTime', () => {
  it('should format a Date object', () => {
    const d = new Date(2025, 0, 15, 9, 5, 30)
    const result = formatTime(d)
    expect(result).toContain('2025-01-15')
    expect(result).toContain('09:05:30')
  })

  it('should format an ISO string', () => {
    const result = formatTime('2025-06-01T12:30:00Z')
    expect(result).toContain('2025-06-01')
  })
})

describe('formatDuration', () => {
  it('should format milliseconds to readable duration', () => {
    expect(formatDuration(0)).toBe('0s')
    expect(formatDuration(1000)).toBe('1s')
    expect(formatDuration(65000)).toBe('1m 5s')
    expect(formatDuration(3661000)).toBe('1h 1m 1s')
  })
})
