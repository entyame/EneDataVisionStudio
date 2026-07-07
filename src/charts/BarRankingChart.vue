<template>
  <BasePanel title="城市排名">
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
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { RankItem } from '@/types/dashboard'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  data: RankItem[]
}>()

const chartOption = computed(() => {
  // 取前8名反转顺序让条形图从上到下排列
  const top = [...props.data].slice(0, 8).reverse()

  return {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      backgroundColor: 'rgba(20, 10, 40, 0.9)',
      borderColor: 'rgba(140, 100, 220, 0.5)',
      textStyle: { color: '#e0d0ff', fontSize: 12 },
    },
    grid: {
      left: 8,
      right: 24,
      top: 8,
      bottom: 8,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(140, 100, 220, 0.12)' } },
      axisLabel: {
        color: '#9080b0',
        fontSize: 10,
        formatter: (v: number) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : String(v)),
      },
    },
    yAxis: {
      type: 'category',
      data: top.map((d) => d.name),
      axisLine: { lineStyle: { color: 'rgba(140, 100, 220, 0.3)' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#b0a0d0',
        fontSize: 11,
      },
    },
    series: [
      {
        type: 'bar',
        data: top.map((d) => d.value),
        barWidth: 14,
        itemStyle: {
          borderRadius: [0, 3, 3, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#7c4dff' },
              { offset: 1, color: '#c0a0ff' },
            ],
          },
        },
        label: {
          show: true,
          position: 'right',
          color: '#c0a0ff',
          fontSize: 10,
          formatter: (p: { value: number }) => (p.value >= 1000 ? (p.value / 1000).toFixed(1) + 'k' : String(p.value)),
        },
      },
    ],
  }
})
</script>
