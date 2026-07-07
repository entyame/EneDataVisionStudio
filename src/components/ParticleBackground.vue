<template>
  <canvas ref="canvasRef" class="particle-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let particles: Particle[] = []
const PARTICLE_COUNT = 80
const CONNECTION_DIST = 140

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  alphaDir: number
  color: string
}

const COLORS = [
  'rgba(179, 136, 255, ALPHA)',  // purple
  'rgba(200, 160, 255, ALPHA)',  // light purple
  'rgba(255, 213, 79, ALPHA)',   // gold
  'rgba(255, 213, 79, ALPHA)',   // gold (double weight)
]

function createParticle(w: number, h: number): Particle {
  const colorTpl = COLORS[Math.floor(Math.random() * COLORS.length)]
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.8,
    alpha: Math.random() * 0.5 + 0.2,
    alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
    color: colorTpl,
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fillStyle = p.color.replace('ALPHA', String(p.alpha))
  ctx.fill()

  // 外发光
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
  ctx.fillStyle = p.color.replace('ALPHA', String(p.alpha * 0.12))
  ctx.fill()
}

function drawConnection(ctx: CanvasRenderingContext2D, conn: { a: Particle; b: Particle; alpha: number }) {
  const { a, b } = conn
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist > CONNECTION_DIST) return

  const alpha = (1 - dist / CONNECTION_DIST) * 0.25
  const midX = (a.x + b.x) / 2
  const midY = (a.y + b.y) / 2

  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.strokeStyle = `rgba(179, 136, 255, ${alpha})`
  ctx.lineWidth = 0.5
  ctx.stroke()

  // 中间亮点
  if (dist < CONNECTION_DIST * 0.7) {
    ctx.beginPath()
    ctx.arc(midX, midY, 1.2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(179, 136, 255, ${alpha * 2})`
    ctx.fill()
  }
}

// 数据流线
interface StreamLine {
  x: number
  y: number
  length: number
  speed: number
  alpha: number
  alphaDir: number
}
let streamLines: StreamLine[] = []

function createStreamLines(w: number, h: number) {
  streamLines = []
  for (let i = 0; i < 8; i++) {
    streamLines.push({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.3 + 0.1,
      alphaDir: Math.random() > 0.5 ? 0.002 : -0.002,
    })
  }
}

function drawStreamLine(ctx: CanvasRenderingContext2D, sl: StreamLine) {
  const grad = ctx.createLinearGradient(sl.x, sl.y, sl.x, sl.y + sl.length)
  grad.addColorStop(0, `rgba(179, 136, 255, ${sl.alpha})`)
  grad.addColorStop(0.5, `rgba(179, 136, 255, ${sl.alpha * 0.4})`)
  grad.addColorStop(1, 'rgba(179, 136, 255, 0)')

  ctx.beginPath()
  ctx.moveTo(sl.x, sl.y)
  ctx.lineTo(sl.x, sl.y + sl.length)
  ctx.strokeStyle = grad
  ctx.lineWidth = 1
  ctx.stroke()
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  // 更新并绘制粒子
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.alpha += p.alphaDir

    if (p.alpha >= 0.7 || p.alpha <= 0.08) p.alphaDir *= -1
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0

    drawParticle(ctx, p)
  }

  // 连线
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      if (dx * dx + dy * dy < CONNECTION_DIST * CONNECTION_DIST) {
        drawConnection(ctx, { a: particles[i], b: particles[j], alpha: 0 })
      }
    }
  }

  // 数据流线
  for (const sl of streamLines) {
    sl.y -= sl.speed
    sl.alpha += sl.alphaDir
    if (sl.alpha >= 0.35 || sl.alpha <= 0.05) sl.alphaDir *= -1
    if (sl.y < -sl.length) {
      sl.y = h + sl.length
      sl.x = Math.random() * w
    }
    drawStreamLine(ctx, sl)
  }

  animId = requestAnimationFrame(animate)
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas.width, canvas.height))
  createStreamLines(canvas.width, canvas.height)
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  animId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
