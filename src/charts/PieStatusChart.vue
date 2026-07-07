<template>
  <BasePanel title="分类占比">
    <VChart :option="chartOption" :autoresize="true" style="width:100%;height:100%" />
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
import BasePanel from '@/components/BasePanel.vue'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{ data: CategoryItem[] }>()

const chartOption = computed(() => ({
  backgroundColor:'transparent',
  tooltip:{ trigger:'item' as const, backgroundColor:'rgba(10,6,22,0.95)', borderColor:'rgba(179,136,255,0.3)',
    textStyle:{color:'#e0d8f0',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"}, formatter:'{b}: {c}%' },
  legend:{ orient:'vertical' as const, right:4, top:'center',
    textStyle:{color:'#9890b8',fontSize:13,fontFamily:"'Rajdhani','Microsoft YaHei',sans-serif"}, itemWidth:10, itemHeight:10 },
  series:[{ type:'pie', radius:['52%','78%'], center:['38%','50%'], avoidLabelOverlap:false,
    itemStyle:{ borderRadius:3, borderColor:'rgba(10,6,22,0.9)', borderWidth:3 },
    label:{ show:false },
    emphasis:{ label:{ show:true, fontSize:16, fontWeight:'bold', color:'#fff' }, scaleSize:10,
      itemStyle:{ shadowBlur:20, shadowColor:'rgba(179,136,255,0.4)' } },
    data: props.data.map(d=>({ name:d.name, value:d.value })),
  }],
  color: ['#b388ff', '#ffd54f', '#cc99ff', '#ffab00', '#7c4dff'],
}))
</script>
