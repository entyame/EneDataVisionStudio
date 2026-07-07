<template>
  <BasePanel title="分类占比">
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
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { CategoryItem } from '@/types/dashboard'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  data: CategoryItem[]
}>()

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item' as const,
    backgroundColor: 'rgba(20, 10, 40, 0.9)',
    borderColor: 'rgba(140, 100, 220, 0.5)',
    textStyle: { color: '#e0d0ff', fontSize: 12 },
    formatter: '{b}: {c}% ({d}%)',
  },
  legend: {
    orient: 'vertical' as const,
    right: 4,
    top: 'center',
    textStyle: { color: '#b0a0d0', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: 'rgba(20, 10, 40, 0.8)',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#ffffff',
        },
        scaleSize: 8,
      },
      data: props.data.map((d) => ({
        name: d.name,
        value: d.value,
      })),
    },
  ],
  color: ['#c0a0ff', '#ffd54f', '#69f0ae', '#40c4ff', '#ff8a80'],
}))
</script>
