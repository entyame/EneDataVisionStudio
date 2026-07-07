/**
 * 大屏自适应缩放工具
 *
 * 基于 1920×1080 设计稿，按比例缩放页面以适配不同分辨率。
 */

export interface ResizeOptions {
  /** 设计稿宽度，默认 1920 */
  designWidth?: number
  /** 设计稿高度，默认 1080 */
  designHeight?: number
  /** 缩放目标元素选择器，默认 #app */
  target?: string
}

/**
 * 初始化大屏自适应缩放
 * 使用 CSS transform: scale 按比例缩放，保持 16:9 比例
 */
export function initScreenAdaptation(options: ResizeOptions = {}): () => void {
  const { designWidth = 1920, designHeight = 1080, target = '#app' } = options

  const handleResize = (): void => {
    const el = document.querySelector(target) as HTMLElement | null
    if (!el) return

    const { innerWidth: ww, innerHeight: wh } = window
    const scaleX = ww / designWidth
    const scaleY = wh / designHeight
    const scale = Math.min(scaleX, scaleY)

    el.style.width = `${designWidth}px`
    el.style.height = `${designHeight}px`
    el.style.transform = `scale(${scale})`
    el.style.transformOrigin = 'left top'
    el.style.position = 'absolute'
    el.style.left = `${(ww - designWidth * scale) / 2}px`
    el.style.top = `${(wh - designHeight * scale) / 2}px`
  }

  handleResize()
  window.addEventListener('resize', handleResize)

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}
