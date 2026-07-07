<template>
  <BasePanel title="能力雷达" accent="purple">
    <VChart :option="chartOption" :autoresize="true" style="width: 100%; height: 100%" />
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
import BasePanel from '@/components/BasePanel.vue'

use([RadarChart, TooltipComponent, LegendComponent, RadarComponent, CanvasRenderer])

const props = defineProps<{ indicators: RadarIndicator[]; series: RadarSeries[] }>()

const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    backgroundColor: 'rgba(6, 8, 22, 0.95)',
    borderColor: 'rgba(179, 136, 255, 0.3)',
    textStyle: { color: '#e0e0f0', fontSize: 12, fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif" },
  },
  legend: {
    bottom: 0,
    textStyle: { color: '#9090b8', fontSize: 12, fontFamily: "'Rajdhani','Microsoft YaHei',sans-serif" },
    data: props.series.map((s) => s.name),
    itemWidth: 12, itemHeight: 8,
  },
  radar: {
    center: ['50%', '46%'],
    radius: '62%',
    indicator: props.indicators.map((ind) => ({ name: ind.name, max: ind.max })),
    axisName: { color: '#9090b8', fontSize: 12 },
    splitArea: { areaStyle: { color: ['rgba(0, 229, 255, 0.03)', 'rgba(0, 0, 0, 0.02)'] } },
    splitLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.1)' } },
    axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.15)' } },
  },
  series: props.series.map((s, i) => {
    const colors = ['#b388ff', '#00e5ff']
    return {
      type: 'radar' as const,
      name: s.name,
      data: [{ value: s.data, name: s.name }],
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { width: 2, color: colors[i], shadowBlur: 8, shadowColor: colors[i] },
      areaStyle: { color: colors[i] + '20' },
      itemStyle: { color: colors[i] },
    }
  }),
}))
</script>
