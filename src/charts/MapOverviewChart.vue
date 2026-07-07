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
   核心思路：将中国城市经纬度 投影到 画布坐标空间 [X:0-100, Y:0-100]
   让节点从最左排到最右、最上排到最下，充分利用全部画布面积。
   真实经度 87-127 → X 2-98   真实纬度 20-47 → Y 3-97
   ================================================================ */

function project(lng: number, lat: number): [number, number] {
  // longitude 87-127 → canvas X 2-98
  const x = 2 + ((lng - 87) / (127 - 87)) * 96
  // latitude 20-47 → canvas Y 3-97 (注意：纬度越大越靠上 = Y越小)
  const y = 97 - ((lat - 20) / (47 - 20)) * 94
  // clamp
  return [Math.max(1, Math.min(99, x)), Math.max(1, Math.min(99, y))]
}

// 中心根节点：画布正中央
const CENTER: [number, number] = [50, 50]

// 32 个背景暗点城市（真实经纬度 → 投影坐标）
const BG_RAW: [string, number, number][] = [
  ['乌鲁木齐',87.68,43.77],['拉萨',91.11,29.97],['西宁',101.74,36.56],['兰州',103.73,36.03],
  ['银川',106.27,38.47],['呼和浩特',111.65,40.82],['哈尔滨',126.63,45.75],['长春',125.35,43.88],
  ['沈阳',123.38,41.8],  ['北京',116.46,39.92],['天津',117.2,39.13], ['石家庄',114.48,38.03],
  ['太原',112.53,37.87], ['西安',108.95,34.27],['郑州',113.65,34.76],['济南',117.0,36.65],
  ['成都',104.06,30.67], ['重庆',106.54,29.59],['武汉',114.31,30.52],['合肥',117.27,31.86],
  ['南京',118.78,32.04], ['上海',121.48,31.22],['杭州',120.19,30.26],['南昌',115.89,28.68],
  ['长沙',112.98,28.19], ['贵阳',106.71,26.57],['昆明',102.73,25.04],['福州',119.3,26.08],
  ['南宁',108.33,22.84], ['广州',113.23,23.16],['深圳',114.07,22.62],['海口',110.35,20.02],
]

const bgDots = BG_RAW.map(([name, lng, lat]) => {
  const [x, y] = project(lng, lat)
  return { name, value: [x, y, 0] }
})

// 活跃城市去重
const activeNames = new Set(props.data.map(p => p.name))
const dimDots = bgDots.filter(c => !activeNames.has(c.name))

// 活跃城市：投影坐标（直接覆盖原数据，不再用浮动偏移避免重叠）
function projectedActive() {
  return props.data.map(p => {
    const [x, y] = project(p.value[0], p.value[1])
    return { name: p.name, value: [x, y, p.value[2]] }
  })
}

// 中心 → 各活跃城市飞线
const flightLines = computed(() => {
  return projectedActive().map(p => ({
    coords: [CENTER, [p.value[0], p.value[1]]] as [[number,number],[number,number]],
  }))
})

// 城市浮动偏移
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
  // 画布坐标系：X 0-100, Y 0-100，无多余留白
  grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
  xAxis: { type: 'value', show: false, min: 0, max: 100 },
  yAxis: { type: 'value', show: false, min: 0, max: 100 },
  animationDurationUpdate: 1400,
  series: [
    // ① 背景暗点（32城均匀分布全画布）
    {
      type: 'scatter',
      data: dimDots,
      symbolSize: 5,
      itemStyle: { color: 'rgba(179,136,255,0.16)' },
      emphasis: { scale: 1.5, itemStyle: { color: 'rgba(179,136,255,0.45)' } },
      z: 0,
    },
    // ② 中心根节点 — 金色菱形 + 强力脉冲涟漪
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
    // ③ 飞线 — 中心向四面八方辐射 + 粒子流动
    {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      polyline: false,
      data: flightLines.value,
      lineStyle: { color: 'rgba(179,136,255,0.25)', width: 1.5, curveness: 0.1 },
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
    // ④ 活跃城市 — 金色节点 + 紫色涟漪 + 浮动摇摆
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
