<template>
  <BasePanel title="能力雷达">
    <VChart :option="chartOption" :autoresize="true" style="width:100%;height:100%" />
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
  backgroundColor:'transparent',
  tooltip:{ backgroundColor:'rgba(10,6,22,0.95)', borderColor:'rgba(179,136,255,0.3)',
    textStyle:{color:'#e0d8f0',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"} },
  legend:{ bottom:0, textStyle:{color:'#9890b8',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"},
    data:props.series.map(s=>s.name), itemWidth:12, itemHeight:8 },
  radar:{ center:['50%','46%'], radius:'62%',
    indicator:props.indicators.map(ind=>({name:ind.name,max:ind.max})),
    axisName:{color:'#9890b8',fontSize:13},
    splitArea:{areaStyle:{color:['rgba(179,136,255,0.03)','rgba(0,0,0,0.02)']}},
    splitLine:{lineStyle:{color:'rgba(179,136,255,0.1)'}},
    axisLine:{lineStyle:{color:'rgba(179,136,255,0.15)'}} },
  series:props.series.map((s,i)=>{const c=['#b388ff','#ffd54f'][i];
    return { type:'radar' as const, name:s.name, data:[{value:s.data,name:s.name}],
      symbol:'circle', symbolSize:5, lineStyle:{width:2.5,color:c,shadowBlur:8,shadowColor:c},
      areaStyle:{color:c+'20'}, itemStyle:{color:c} }}),
}))
</script>
