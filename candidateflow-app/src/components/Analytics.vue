<template>
  <div class="space-y-6">
    <h2 class="text-2xl">Recruitment Analytics</h2>

    <!-- Карточки статистики -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Candidates</p>
            <p class="text-3xl">{{ totalCandidates }}</p>
          </div>
          <Users class="w-10 h-10 text-blue-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Active</p>
            <p class="text-3xl">{{ activeCount }}</p>
          </div>
          <TrendingUp class="w-10 h-10 text-purple-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Hired</p>
            <p class="text-3xl">{{ hiredCount }}</p>
          </div>
          <CheckCircle class="w-10 h-10 text-green-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p class="text-3xl">{{ conversionRate }}%</p>
          </div>
          <XCircle class="w-10 h-10 text-red-500" />
        </div>
      </div>
    </div>

    <!-- График воронки кандидатов -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg mb-4">Candidate Funnel</h3>
      <div ref="funnelChart" class="w-full h-80"></div>
    </div>

    <!-- Статус по этапам -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg mb-4">Stage Distribution</h3>
      <div ref="stageChart" class="w-full h-64"></div>
    </div>

    <!-- Последние заявки -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg mb-4">Recent Applications</h3>
      <div class="space-y-2">
        <div
          v-for="candidate in recentCandidates"
          :key="candidate.id"
          class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p class="text-gray-900">{{ candidate.name }}</p>
            <p class="text-sm text-gray-600">{{ candidate.position }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">
              {{ formatDate(candidate.appliedAt) }}
            </p>
            <span 
              class="text-xs px-2 py-1 rounded"
              :style="{ backgroundColor: getStageColor(candidate.stage), color: getTextColor(candidate.stage) }"
            >
              {{ getStageLabel(candidate.stage) }}
            </span>
          </div>
        </div>
        <p v-if="candidates.length === 0" class="text-center text-gray-500 py-4">No candidates yet</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-vue-next'

const STAGES = [
  { id: 'applied', label: 'Applied', color: '#9CA3AF' },
  { id: 'screening', label: 'Screening', color: '#3B82F6' },
  { id: 'interview', label: 'Interview', color: '#8B5CF6' },
  { id: 'offer', label: 'Offer', color: '#F59E0B' },
  { id: 'hired', label: 'Hired', color: '#10B981' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' }
]

export default {
  name: 'Analytics',
  components: {
    TrendingUp,
    Users,
    CheckCircle,
    XCircle
  },
  props: {
    candidates: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const funnelChart = ref(null)
    const stageChart = ref(null)
    let funnelInstance = null
    let stageInstance = null

    const totalCandidates = ref(0)
    const hiredCount = ref(0)
    const rejectedCount = ref(0)
    const activeCount = ref(0)
    const conversionRate = ref('0')
    const recentCandidates = ref([])

    const getStageColor = (stageId) => {
      const stage = STAGES.find(s => s.id === stageId)
      return stage ? stage.color : '#9CA3AF'
    }

    const getTextColor = (stageId) => {
      const darkStages = ['screening', 'interview', 'hired', 'rejected']
      return darkStages.includes(stageId) ? 'white' : '#1F2937'
    }

    const getStageLabel = (stageId) => {
      const stage = STAGES.find(s => s.id === stageId)
      return stage ? stage.label : stageId
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const calculateMetrics = () => {
      totalCandidates.value = props.candidates.length
      hiredCount.value = props.candidates.filter(c => c.stage === 'hired').length
      rejectedCount.value = props.candidates.filter(c => c.stage === 'rejected').length
      activeCount.value = totalCandidates.value - hiredCount.value - rejectedCount.value
      conversionRate.value = totalCandidates.value > 0 
        ? ((hiredCount.value / totalCandidates.value) * 100).toFixed(1) 
        : '0'

      recentCandidates.value = [...props.candidates]
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        .slice(0, 5)
    }

    const initFunnelChart = () => {
      if (!funnelChart.value) return
      
      if (funnelInstance) {
        funnelInstance.dispose()
      }

      funnelInstance = echarts.init(funnelChart.value)

      const stageStats = STAGES.map(stage => ({
        name: stage.label,
        value: props.candidates.filter(c => c.stage === stage.id).length,
        itemStyle: {
          color: stage.color
        }
      }))

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} candidates ({d}%)'
        },
        legend: {
          top: 'bottom',
          type: 'scroll'
        },
        series: [
          {
            name: 'Candidates',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: stageStats
          }
        ]
      }

      funnelInstance.setOption(option)
    }

    const initStageChart = () => {
      if (!stageChart.value) return
      
      if (stageInstance) {
        stageInstance.dispose()
      }

      stageInstance = echarts.init(stageChart.value)

      const stageData = STAGES.map(stage => ({
        name: stage.label,
        value: props.candidates.filter(c => c.stage === stage.id).length,
        itemStyle: {
          color: stage.color
        }
      }))

      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: stageData.map(item => item.name),
          axisLabel: {
            rotate: 45,
            fontSize: 11
          },
          axisLine: {
            lineStyle: {
              color: '#E5E7EB'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#E5E7EB'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#F3F4F6',
              type: 'dashed'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E5E7EB',
          textStyle: {
            color: '#374151'
          },
          formatter: function(params) {
            const data = params[0]
            return `<div class="font-medium">${data.name}</div>
                    <div class="mt-1">Candidates: <span class="font-bold">${data.value}</span></div>`
          }
        },
        series: [
          {
            data: stageData,
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              color: '#374151',
              fontWeight: 'bold',
              fontSize: 11
            },
            emphasis: {
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            }
          }
        ]
      }

      stageInstance.setOption(option)
    }

    const resizeCharts = () => {
      if (funnelInstance) {
        funnelInstance.resize()
      }
      if (stageInstance) {
        stageInstance.resize()
      }
    }

    const initCharts = () => {
      calculateMetrics()
      nextTick(() => {
        initFunnelChart()
        initStageChart()
      })
    }

    onMounted(() => {
      initCharts()
      window.addEventListener('resize', resizeCharts)
    })

    onUnmounted(() => {
      if (funnelInstance) {
        funnelInstance.dispose()
      }
      if (stageInstance) {
        stageInstance.dispose()
      }
      window.removeEventListener('resize', resizeCharts)
    })

    watch(() => props.candidates, () => {
      calculateMetrics()
      nextTick(() => {
        if (funnelInstance) {
          const stageStats = STAGES.map(stage => ({
            name: stage.label,
            value: props.candidates.filter(c => c.stage === stage.id).length,
            itemStyle: {
              color: stage.color
            }
          }))
          
          funnelInstance.setOption({
            series: [{
              data: stageStats
            }]
          })
        }

        if (stageInstance) {
          const stageData = STAGES.map(stage => ({
            name: stage.label,
            value: props.candidates.filter(c => c.stage === stage.id).length,
            itemStyle: {
              color: stage.color
            }
          }))
          
          stageInstance.setOption({
            xAxis: {
              data: stageData.map(item => item.name)
            },
            series: [{
              data: stageData
            }]
          })
        }
      })
    }, { deep: true })

    return {
      funnelChart,
      stageChart,
      totalCandidates,
      hiredCount,
      activeCount,
      conversionRate,
      recentCandidates,
      getStageColor,
      getTextColor,
      getStageLabel,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Стили для тултипов ECharts */
:deep(.echarts-tooltip) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem !important;
}

:deep(.echarts-tooltip-title) {
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  color: #111827 !important;
}

:deep(.echarts-tooltip-content) {
  color: #374151 !important;
}
</style>