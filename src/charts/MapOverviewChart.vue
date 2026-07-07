<template>
  <BasePanel title="全国态势总览" accent="cyan">
    <VChart :option="chartOption" :autoresize="true" style="width: 100%; height: 100%" />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { ScatterChart, EffectScatterChart, LinesChart } from 'echarts/charts'
import { TooltipComponent, GeoComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { MapPoint } from '@/types/dashboard'
import BasePanel from '@/components/BasePanel.vue'

use([ScatterChart, EffectScatterChart, LinesChart, TooltipComponent, GeoComponent, GridComponent, CanvasRenderer])

const props = defineProps<{ data: MapPoint[] }>()

// 背景网格坐标（模拟全国暗点）
const CITY_COORDS: Record<string, [number, number]> = {
  北京: [116.46, 39.92], 上海: [121.48, 31.22], 深圳: [114.07, 22.62],
  广州: [113.23, 23.16], 杭州: [120.19, 30.26], 成都: [104.06, 30.67],
  南京: [118.78, 32.04], 武汉: [114.31, 30.52], 西安: [108.95, 34.27],
  重庆: [106.54, 29.59], 长沙: [112.98, 28.19], 郑州: [113.65, 34.76],
  济南: [117.0, 36.65],  天津: [117.2, 39.13],  苏州: [120.62, 31.32],
  沈阳: [123.38, 41.8],  哈尔滨: [126.63, 45.75], 昆明: [102.73, 25.04],
  贵阳: [106.71, 26.57], 兰州: [103.73, 36.03], 乌鲁木齐: [87.68, 43.77],
  拉萨: [91.11, 29.97],  呼和浩特: [111.65, 40.82], 南宁: [108.33, 22.84],
  合肥: [117.27, 31.86], 南昌: [115.89, 28.68], 福州: [119.3, 26.08],
}

const allCities = Object.entries(CITY_COORDS).map(([name, coords]) => ({ name, value: [...coords, 0] }))
const activeNames = new Set(props.data.map((p) => p.name))
const dimCities = allCities.filter((c) => !activeNames.has(c.name))

// 构建飞线：北京 → 各活跃城市
const flightLines = props.data
  .filter((p) => p.name !== '北京')
  .map((p) => ({
    coords: [[116.46, 39.92], [p.value[0], p.value[1]]],
  }))

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item' as const,
    backgroundColor: 'rgba(6, 8, 22, 0.95)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
    textStyle: { color: '#e0e0f0', fontSize: 12, fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif" },
    formatter: (p: { name: string; value: number[] }) =>
      `<span style="color:#00e5ff">◈</span> ${p.name}<br/>活跃度: <span style="color:#ffd54f">${p.value[2]?.toLocaleString('zh-CN') ?? '-'}</span>`,
  },
  grid: { left: 0, right: 0, top: 0, bottom: 0 },
  xAxis: { type: 'value', show: false, min: 73, max: 135 },
  yAxis: { type: 'value', show: false, min: 16, max: 54 },
  series: [
    // 背景暗点（非活跃城市）
    {
      type: 'scatter',
      data: dimCities,
      symbolSize: 4,
      itemStyle: { color: 'rgba(0, 229, 255, 0.2)' },
      emphasis: { scale: 1.4, itemStyle: { color: 'rgba(0, 229, 255, 0.5)' } },
      silent: false,
      z: 0,
    },
    // 飞线
    {
      type: 'lines',
      coordinateSystem: 'cartesian2d',
      polyline: false,
      data: flightLines,
      lineStyle: {
        color: 'rgba(0, 229, 255, 0.2)',
        width: 1,
        curveness: 0.2,
      },
      effect: {
        show: true,
        period: 6,
        trailLength: 0.3,
        symbol: 'circle',
        symbolSize: 3,
        color: '#00e5ff',
      },
      z: 1,
    },
    // 活跃城市（带涟漪）
    {
      type: 'effectScatter',
      data: props.data.map((p) => ({ name: p.name, value: p.value })),
      symbolSize: (val: number[]) => Math.max(10, Math.min(26, val[2] / 600)),
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 3.5,
        period: 3.5,
        color: '#00e5ff',
      },
      itemStyle: {
        color: '#ffd54f',
        shadowBlur: 12,
        shadowColor: 'rgba(255, 213, 79, 0.5)',
      },
      label: {
        show: true,
        formatter: (p: { name: string }) => p.name,
        position: 'bottom',
        color: '#c8d8f0',
        fontSize: 12,
        distance: 3,
        fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif",
      },
      z: 2,
    },
  ],
}))
</script>
