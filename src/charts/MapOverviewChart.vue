<template>
  <BasePanel title="全国态势总览">
    <VChart
      :option="chartOption"
      :autoresize="true"
      style="width: 100%; height: 100%"
    />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { ScatterChart, EffectScatterChart } from 'echarts/charts'
import { TooltipComponent, GeoComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { MapPoint } from '@/types/dashboard'

// 按需注册
use([ScatterChart, EffectScatterChart, TooltipComponent, GeoComponent, CanvasRenderer])

const props = defineProps<{
  data: MapPoint[]
}>()

// 全国省份中心坐标（用于背景散点）
const CITY_COORDS: Record<string, [number, number]> = {
  北京: [116.46, 39.92],
  上海: [121.48, 31.22],
  深圳: [114.07, 22.62],
  广州: [113.23, 23.16],
  杭州: [120.19, 30.26],
  成都: [104.06, 30.67],
  南京: [118.78, 32.04],
  武汉: [114.31, 30.52],
  西安: [108.95, 34.27],
  重庆: [106.54, 29.59],
  长沙: [112.98, 28.19],
  郑州: [113.65, 34.76],
  济南: [117.0, 36.65],
  天津: [117.2, 39.13],
  苏州: [120.62, 31.32],
}

// 生成覆盖全国的"暗点"作为背景
const allCities = Object.entries(CITY_COORDS).map(([name, coords]) => ({
  name,
  value: [...coords, 0],
}))

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item' as const,
    backgroundColor: 'rgba(20, 10, 40, 0.9)',
    borderColor: 'rgba(140, 100, 220, 0.5)',
    textStyle: { color: '#e0d0ff', fontSize: 12 },
    formatter: (p: { name: string; value: number[] }) =>
      `${p.name}<br/>活跃度: ${p.value[2]?.toLocaleString('zh-CN') ?? '-'}`,
  },
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  xAxis: {
    type: 'value',
    show: false,
    min: 73,
    max: 135,
  },
  yAxis: {
    type: 'value',
    show: false,
    min: 16,
    max: 54,
  },
  series: [
    // 背景暗点
    {
      type: 'scatter',
      data: allCities,
      symbolSize: 6,
      itemStyle: {
        color: 'rgba(140, 100, 220, 0.4)',
      },
      emphasis: { scale: 1 },
      silent: true,
    },
    // 数据亮点（带涟漪）
    {
      type: 'effectScatter',
      data: props.data.map((p) => ({
        name: p.name,
        value: p.value,
      })),
      symbolSize: (val: number[]) => Math.max(8, Math.min(24, val[2] / 800)),
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke',
        scale: 3,
        period: 4,
        color: '#c0a0ff',
      },
      itemStyle: {
        color: '#ffd54f',
        shadowBlur: 10,
        shadowColor: 'rgba(255, 213, 79, 0.4)',
      },
      label: {
        show: true,
        formatter: (p: { name: string }) => p.name,
        position: 'bottom',
        color: '#c0c0d0',
        fontSize: 9,
        distance: 2,
      },
    },
  ],
}))
</script>
