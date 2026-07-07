<template>
  <BasePanel title="全国态势总览">
    <VChart :option="chartOption" :autoresize="true" style="width:100%;height:100%" />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { ScatterChart, EffectScatterChart, LinesChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { MapPoint } from '@/types/dashboard'
import BasePanel from '@/components/BasePanel.vue'

use([ScatterChart, EffectScatterChart, LinesChart, TooltipComponent, GridComponent, CanvasRenderer])

const props = defineProps<{ data: MapPoint[] }>()

/* ================================================================
   画布坐标 [0-100, 0-100]，中心 [50,50]
   15 个活跃城市手工布局：360° 均匀辐射 + 错落半径
   北京/上海 → 上半区 (Y<50)   广州/深圳 → 下半区 (Y>50)
   ================================================================ */

const CENTER: [number, number] = [50, 50]

// 手工编排的城市坐标（角度均匀、半径错落、无重叠）
const CITY_POS: Record<string, [number, number]> = {
  // ---- 上半区 ----
  北京:  [50,  8],   // 正上方，长连线
  天津:  [67, 20],   // 右上近
  济南:  [75, 35],   // 右中
  南京:  [86, 47],   // 右中偏下
  上海:  [90, 18],   // 右上方，长连线
  苏州:  [74, 26],   // 右上
  杭州:  [84, 36],   // 右中
  西安:  [16, 30],   // 左上，长连线
  成都:  [24, 18],   // 左上方
  重庆:  [32, 26],   // 左上
  // ---- 下半区 ----
  广州:  [15, 78],   // 左下方，长连线
  深圳:  [28, 85],   // 下方偏左
  长沙:  [38, 70],   // 下方近
  武汉:  [55, 72],   // 正下方
  郑州:  [40, 52],   // 中心偏下
  沈阳:  [70, 12],   // 右上方
  哈尔滨:[85,  8],   // 右上方极远
  昆明:  [12, 60],   // 左下方
  贵阳:  [22, 56],   // 左下方
  福州:  [68, 55],   // 右下
}

// 32 个背景暗点：覆盖全画布四个象限
function buildBgDots(): { name: string; value: [number, number, number] }[] {
  const dots: { name: string; value: [number, number, number] }[] = []
  // 网格撒点 6×6 = 36 个，去掉太靠近中心的
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const x = 5 + col * 15 + (Math.random() - 0.5) * 6
      const y = 5 + row * 15 + (Math.random() - 0.5) * 6
      if (x < 2 || x > 98 || y < 2 || y > 98) continue
      // 去掉离中心太近的（避免和中枢重叠）
      const dx = x - 50, dy = y - 50
      if (Math.sqrt(dx * dx + dy * dy) < 10) continue
      dots.push({ name: `bg-${row}-${col}`, value: [x, y, 0] })
    }
  }
  return dots
}

const bgDots = buildBgDots()

// 活跃城市：用预设坐标
function projectedActive() {
  return props.data.map(p => {
    const pos = CITY_POS[p.name]
    if (pos) return { name: p.name, value: [pos[0], pos[1], p.value[2]] }
    // fallback：均匀撒点
    const i = props.data.indexOf(p)
    const angle = (i / props.data.length) * Math.PI * 2
    const dist = 25 + (i % 3) * 10
    return {
      name: p.name,
      value: [50 + Math.cos(angle) * dist, 50 + Math.sin(angle) * dist, p.value[2]],
    }
  })
}

// 中心→各城市飞线
const flightLines = computed(() =>
  projectedActive().map(p => ({
    coords: [CENTER, [p.value[0], p.value[1]]] as [[number, number], [number, number]],
  })),
)

// 浮动偏移
const floatOffsets = shallowRef<Record<string, { dx: number; dy: number }>>({})
let floatTimer: ReturnType<typeof setInterval> | null = null
function randomOffsets() {
  const off: Record<string, { dx: number; dy: number }> = {}
  for (const p of props.data) {
    off[p.name] = { dx: (Math.random() - 0.5) * 1.5, dy: (Math.random() - 0.5) * 1.5 }
  }
  floatOffsets.value = off
}
onMounted(() => { randomOffsets(); floatTimer = setInterval(randomOffsets, 2000) })
onUnmounted(() => { if (floatTimer) clearInterval(floatTimer) })

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item' as const,
    backgroundColor: 'rgba(10,6,22,0.95)',
    borderColor: 'rgba(179,136,255,0.45)',
    textStyle: { color: '#e0d8f0', fontSize: 13, fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif" },
    formatter: (p: { name: string; value: number[] }) =>
      `<span style="color:#b388ff">◈</span> ${p.name}<br/>活跃度: <span style="color:#ffd54f">${p.value[2]?.toLocaleString('zh-CN') ?? '-'}</span>`,
  },
  grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
  xAxis: { type: 'value', show: false, min: 0, max: 100 },
  yAxis: { type: 'value', show: false, min: 0, max: 100 },
  animationDurationUpdate: 1400,
  series: [
    // ① 背景暗点（均匀网格，铺满全画布）
    {
      type: 'scatter',
      data: bgDots,
      symbolSize: 3,
      itemStyle: { color: 'rgba(179,136,255,0.12)' },
      emphasis: { scale: 1.8, itemStyle: { color: 'rgba(179,136,255,0.4)' } },
      silent: false,
      z: 0,
    },
    // ② 中枢 — 金色菱形 + 强力脉冲
    {
      type: 'effectScatter',
      data: [{ name: '中枢', value: [...CENTER, 99999] }],
      symbolSize: 22,
      symbol: 'diamond',
      rippleEffect: { brushType: 'stroke', scale: 8, period: 2.5, color: '#ffd54f' },
      itemStyle: { color: '#ffd54f', shadowBlur: 24, shadowColor: 'rgba(255,213,79,0.7)' },
      label: {
        show: true, formatter: '中枢', position: 'bottom',
        color: '#ffd54f', fontSize: 13, distance: 6,
        fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif",
      },
      z: 4,
    },
    // ③ 飞线 — 各个方向等长辐射
    {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      polyline: false,
      data: flightLines.value,
      lineStyle: { color: 'rgba(179,136,255,0.22)', width: 1.5, curveness: 0.08 },
      effect: {
        show: true,
        period: 5,
        trailLength: 0.35,
        symbol: 'circle',
        symbolSize: 3,
        color: '#b388ff',
      },
      z: 1,
    },
    // ④ 活跃城市 — 金色节点 + 紫色涟漪
    {
      type: 'effectScatter',
      data: projectedActive().map(p => {
        const off = floatOffsets.value[p.name] || { dx: 0, dy: 0 }
        return {
          name: p.name,
          value: [p.value[0] + off.dx, p.value[1] + off.dy, p.value[2]],
        }
      }),
      symbolSize: (val: number[]) => Math.max(12, Math.min(30, val[2] / 500)),
      showEffectOn: 'render',
      rippleEffect: { brushType: 'stroke', scale: 4.5, period: 3, color: '#b388ff' },
      itemStyle: { color: '#ffd54f', shadowBlur: 18, shadowColor: 'rgba(255,213,79,0.55)' },
      label: {
        show: true,
        formatter: (p: { name: string }) => p.name,
        position: 'bottom',
        color: '#d8d0f4',
        fontSize: 13,
        distance: 4,
        fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif",
      },
      z: 2,
    },
  ],
}))
</script>
