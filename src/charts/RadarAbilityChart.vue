<template>
  <BasePanel title="能力雷达">
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
import { RadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, RadarComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { RadarIndicator, RadarSeries } from '@/types/dashboard'

use([RadarChart, TooltipComponent, LegendComponent, RadarComponent, CanvasRenderer])

const props = defineProps<{
  indicators: RadarIndicator[]
  series: RadarSeries[]
}>()

const chartOption = computed(() => ({
  tooltip: {
    backgroundColor: 'rgba(20, 10, 40, 0.9)',
    borderColor: 'rgba(140, 100, 220, 0.5)',
    textStyle: { color: '#e0d0ff', fontSize: 12 },
  },
  legend: {
    bottom: 0,
    textStyle: { color: '#b0a0d0', fontSize: 11 },
    data: props.series.map((s) => s.name),
  },
  radar: {
    center: ['50%', '48%'],
    radius: '65%',
    indicator: props.indicators.map((ind) => ({
      name: ind.name,
      max: ind.max,
    })),
    axisName: {
      color: '#b0a0d0',
      fontSize: 11,
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(120, 80, 200, 0.08)', 'rgba(20, 10, 40, 0.05)'],
      },
    },
    splitLine: {
      lineStyle: { color: 'rgba(140, 100, 220, 0.2)' },
    },
    axisLine: {
      lineStyle: { color: 'rgba(140, 100, 220, 0.3)' },
    },
  },
  series: props.series.map((s) => ({
    type: 'radar',
    name: s.name,
    data: [{ value: s.data, name: s.name }],
    symbol: 'circle',
    symbolSize: 4,
    lineStyle: { width: 2 },
    areaStyle: { opacity: 0.15 },
  })),
  color: ['#c0a0ff', '#ffd54f'],
}))
</script>
