<template>
  <BasePanel title="访问趋势">
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
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { TrendSeries } from '@/types/dashboard'

use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: TrendSeries[]
}>()

const chartOption = computed(() => {
  const series = props.data.map((s) => ({
    name: s.name,
    type: 'line' as const,
    smooth: true,
    symbol: 'circle',
    symbolSize: 4,
    lineStyle: {
      width: 2,
    },
    areaStyle: {
      opacity: 0.1,
    },
    data: s.data.map((d) => d.value),
  }))

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(20, 10, 40, 0.9)',
      borderColor: 'rgba(140, 100, 220, 0.5)',
      textStyle: {
        color: '#e0d0ff',
        fontSize: 13,
      },
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: '#b0a0d0',
        fontSize: 13,
      },
      data: props.data.map((s) => s.name),
    },
    grid: {
      left: 8,
      right: 16,
      top: 16,
      bottom: 32,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data[0]?.data.map((d) => d.time) ?? [],
      axisLine: { lineStyle: { color: 'rgba(140, 100, 220, 0.3)' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#9080b0',
        fontSize: 13,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(140, 100, 220, 0.12)' } },
      axisLabel: {
        color: '#9080b0',
        fontSize: 13,
        formatter: (v: number) => (v >= 10000 ? (v / 10000).toFixed(0) + 'w' : String(v)),
      },
    },
    color: ['#c0a0ff', '#ffd54f'],
    series,
  }
})
</script>
