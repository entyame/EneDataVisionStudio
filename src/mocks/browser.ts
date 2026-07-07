/**
 * MSW Browser Worker 初始化
 *
 * 仅在 VITE_DATA_SOURCE=mock 时启动 Service Worker
 */
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/**
 * 在浏览器环境中启动 MSW
 */
export async function startMockService(): Promise<void> {
  if (import.meta.env.VITE_DATA_SOURCE !== 'mock') {
    return
  }

  try {
    await worker.start({
      onUnhandledRequest: 'bypass', // 放行未被拦截的请求
      quiet: true,
    })
    console.log('[MSW] Mock Service Worker started successfully')
  } catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error)
  }
}
