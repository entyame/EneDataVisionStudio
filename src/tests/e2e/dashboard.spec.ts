/**
 * E2E 测试 — Dashboard 页面
 *
 * 使用 Playwright 验证页面基本功能。
 */
import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test('should display page title', async ({ page }) => {
    await page.goto('/')

    // 等待页面加载
    await page.waitForLoadState('networkidle')

    // 验证页面标题
    const title = await page.title()
    expect(title).toContain('EneDataVisionStudio')
  })

  test('should display header with 如意数据大屏', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 验证大屏标题存在
    await expect(page.locator('.header-title')).toBeVisible()
    const headerText = await page.locator('.header-title').textContent()
    expect(headerText).toContain('如意数据大屏')
  })

  test('should display at least one metric card', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 验证指标卡片
    const cards = page.locator('.metric-card')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('should display chart containers', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 验证图表面板存在
    const panels = page.locator('.base-panel')
    const count = await panels.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('should display activity list', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 验证活动列表
    const items = page.locator('.activity-item')
    const count = await items.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('page should not have console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // MSW 可能会有一些非关键警告，不视为严重错误
    const criticalErrors = errors.filter(
      (e) => !e.includes('MSW') && !e.includes('Failed to load resource'),
    )
    expect(criticalErrors.length).toBe(0)
  })
})
