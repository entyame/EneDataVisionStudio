<template>
  <BasePanel title="访问趋势">
    <VChart :option="chartOption" :autoresize="true" style="width:100%;height:100%" />
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
import BasePanel from '@/components/BasePanel.vue'

use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{ data: TrendSeries[] }>()

const chartOption = computed(() => {
  const colors = ['#b388ff', '#ffd54f']
  const series = props.data.map((s, i) => ({
    name: s.name, type: 'line' as const, smooth: true,
    symbol: 'circle', symbolSize: 5,
    lineStyle: { width: 2.5, color: colors[i], shadowBlur: 8, shadowColor: colors[i] },
    areaStyle: { color: { type: 'linear' as const, x:0,y:0,x2:0,y2:1,
      colorStops: [{offset:0,color:colors[i]+'35'},{offset:1,color:colors[i]+'04'}] } },
    itemStyle: { color: colors[i] },
    data: s.data.map(d => d.value),
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' as const, backgroundColor:'rgba(10,6,22,0.95)', borderColor:'rgba(179,136,255,0.3)',
      textStyle:{color:'#e0d8f0',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"} },
    legend: { bottom:0, textStyle:{color:'#9088b0',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"},
      data: props.data.map(s=>s.name), itemWidth:12, itemHeight:8 },
    grid: { left:6, right:12, top:14, bottom:30, containLabel:true },
    xAxis: { type:'category', boundaryGap:false, data: props.data[0]?.data.map(d=>d.time)??[],
      axisLine:{lineStyle:{color:'rgba(179,136,255,0.15)'}}, axisTick:{show:false},
      axisLabel:{color:'#8880a8',fontSize:12} },
    yAxis: { type:'value', splitLine:{lineStyle:{color:'rgba(179,136,255,0.06)'}},
      axisLabel:{color:'#8880a8',fontSize:12,formatter:(v:number)=>v>=10000?(v/10000).toFixed(0)+'w':String(v)} },
    color: colors,
    series,
  }
})
</script>
