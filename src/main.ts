/**
 * EneDataVisionStudio — 应用入口
 *
 * 启动顺序：
 * 1. 启动 MSW Mock Service Worker（仅在 mock 模式下）
 * 2. 初始化 Pinia 状态管理
 * 3. 挂载 Vue 应用
 * 4. 初始化大屏自适应缩放
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { startMockService } from '@/mocks/browser'
import { initScreenAdaptation } from '@/utils/resize'
import { logger } from '@/logs/logger'
import App from '@/app/App.vue'

async function bootstrap(): Promise<void> {
  logger.info('[Bootstrap] Starting application...')
  logger.info(`[Bootstrap] Data source: ${import.meta.env.VITE_DATA_SOURCE || 'mock'}`)

  // 1. 启动 MSW（仅在 mock 模式生效）
  await startMockService()

  // 2. 创建应用
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.mount('#app')

  logger.info('[Bootstrap] Application mounted successfully')

  // 3. 初始化大屏自适应缩放
  const cleanup = initScreenAdaptation({
    designWidth: 1920,
    designHeight: 1080,
    target: '#app',
  })

  logger.info('[Bootstrap] Screen adaptation initialized')

  // 页面卸载时清理
  window.addEventListener('unload', () => {
    cleanup()
  })
}

bootstrap().catch((error) => {
  logger.error('[Bootstrap] Application failed to start', {
    error: error instanceof Error ? error.message : String(error),
  })
  console.error('Failed to start application:', error)
})
