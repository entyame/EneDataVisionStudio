<template>
  <BasePanel title="城市排名">
    <VChart :option="chartOption" :autoresize="true" style="width:100%;height:100%" />
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
import BasePanel from '@/components/BasePanel.vue'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{ data: RankItem[] }>()

const chartOption = computed(() => {
  const top = [...props.data].slice(0,8).reverse()
  return {
    backgroundColor:'transparent',
    tooltip:{ trigger:'axis' as const, axisPointer:{type:'shadow' as const},
      backgroundColor:'rgba(10,6,22,0.95)', borderColor:'rgba(179,136,255,0.3)',
      textStyle:{color:'#e0d8f0',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"} },
    grid:{ left:6, right:30, top:6, bottom:6, containLabel:true },
    xAxis:{ type:'value', splitLine:{lineStyle:{color:'rgba(179,136,255,0.06)'}},
      axisLabel:{color:'#8880a8',fontSize:13,formatter:(v:number)=>v>=1000?(v/1000).toFixed(0)+'k':String(v)} },
    yAxis:{ type:'category', data:top.map(d=>d.name),
      axisLine:{lineStyle:{color:'rgba(179,136,255,0.15)'}}, axisTick:{show:false},
      axisLabel:{color:'#b8b0d0',fontSize:14,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"} },
    series:[{ type:'bar', data:top.map(d=>({ value:d.value,
      itemStyle:{ borderRadius:[0,4,4,0],
        color:{ type:'linear',x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:'#ffd54f'},{offset:1,color:'#ffab00'}] },
        shadowBlur:8, shadowColor:'rgba(255,213,79,0.25)' } })),
      barWidth:18,
      label:{ show:true, position:'right', color:'#ffd54f', fontSize:13, fontFamily:"'Rajdhani',sans-serif",
        formatter:(p:{value:number})=>p.value>=1000?(p.value/1000).toFixed(1)+'k':String(p.value) },
    }],
  }
})
</script>
