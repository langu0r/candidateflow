<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">Recruitment Analytics</h2>

    <!-- Карточки статистики -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Candidates</p>
            <p class="text-3xl font-semibold">{{ totalCandidates }}</p>
          </div>
          <Users class="w-10 h-10 text-blue-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Active</p>
            <p class="text-3xl font-semibold">{{ activeCount }}</p>
          </div>
          <TrendingUp class="w-10 h-10 text-purple-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Hired</p>
            <p class="text-3xl font-semibold">{{ hiredCount }}</p>
          </div>
          <CheckCircle class="w-10 h-10 text-green-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p class="text-3xl font-semibold">{{ conversionRate }}%</p>
          </div>
          <Target class="w-10 h-10 text-orange-500" />
        </div>
      </div>
    </div>

    <!-- График распределения по этапам (круговая диаграмма) -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold mb-4">Candidate Funnel</h3>
      <div v-if="hasData" ref="funnelChart" class="w-full h-80"></div>
      <div v-else class="w-full h-80 flex items-center justify-center text-gray-500">
        No data available
      </div>
    </div>

    <!-- Столбчатая диаграмма по этапам -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold mb-4">Stage Distribution</h3>
      <div v-if="hasData" ref="stageChart" class="w-full h-64"></div>
      <div v-else class="w-full h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    </div>

    <!-- Последние заявки -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 class="text-lg font-semibold mb-4">Recent Applications</h3>
      <div class="space-y-2">
        <div
          v-for="candidate in recentCandidates"
          :key="candidate.id"
          class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p class="font-medium text-gray-900">{{ candidate.name }}</p>
            <p class="text-sm text-gray-600">{{ candidate.position }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">
              {{ formatDate(candidate.createdAt) }}
            </p>
            <span 
              class="inline-block px-2 py-1 text-xs rounded-full"
              :style="{ 
                backgroundColor: getStageColor(candidate.stage) + '20',
                color: getStageColor(candidate.stage),
                border: '1px solid ' + getStageColor(candidate.stage)
              }"
            >
              {{ getStageLabel(candidate.stage) }}
            </span>
          </div>
        </div>
        <p v-if="candidates.length === 0" class="text-center text-gray-500 py-8">
          No candidates yet
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { TrendingUp, Users, CheckCircle, Target } from 'lucide-vue-next'
import { STAGES, StageColors, StageLabels } from '../constants/stages'

const props = defineProps({
  candidates: {
    type: Array,
    required: true
  }
})

// Refs для графиков
const funnelChart = ref(null)
const stageChart = ref(null)
let funnelInstance = null
let stageInstance = null

// Вычисляемые метрики
const totalCandidates = computed(() => props.candidates.length)
const hiredCount = computed(() => props.candidates.filter(c => c.stage === 'hired').length)
const rejectedCount = computed(() => props.candidates.filter(c => c.stage === 'rejected').length)
const activeCount = computed(() => totalCandidates.value - hiredCount.value - rejectedCount.value)
const conversionRate = computed(() => {
  return totalCandidates.value > 0 
    ? ((hiredCount.value / totalCandidates.value) * 100).toFixed(1) 
    : '0'
})

const hasData = computed(() => props.candidates.length > 0)

const recentCandidates = computed(() => {
  return [...props.candidates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// Получение цвета этапа
const getStageColor = (stageId) => {
  return StageColors[stageId] || '#9CA3AF'
}

// Получение названия этапа
const getStageLabel = (stageId) => {
  return StageLabels[stageId] || stageId
}

// Форматирование даты
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Инициализация круговой диаграммы
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
      color: StageColors[stage.id]
    }
  })).filter(item => item.value > 0)

  if (stageStats.length === 0) {
    return
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} candidates ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: {
        color: '#374151'
      }
    },
    series: [
      {
        name: 'Candidates',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: stageStats
      }
    ]
  }

  funnelInstance.setOption(option)
}

// Инициализация столбчатой диаграммы
const initStageChart = () => {
  if (!stageChart.value) return
  
  if (stageInstance) {
    stageInstance.dispose()
  }

  stageInstance = echarts.init(stageChart.value)

  const stageData = STAGES.map(stage => ({
    name: stage.label,
    value: props.candidates.filter(c => c.stage === stage.id).length
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
        fontSize: 11,
        color: '#4B5563'
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
        show: false
      },
      axisTick: {
        show: false
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
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const data = params[0]
        return `<div class="font-medium">${data.name}</div>
                <div class="mt-1">Candidates: <span class="font-bold">${data.value}</span></div>`
      }
    },
    series: [
      {
        name: 'Candidates',
        type: 'bar',
        data: stageData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: StageColors[STAGES[index].id] || '#3B82F6'
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          color: '#374151',
          fontWeight: 'bold',
          fontSize: 11,
          formatter: '{c}'
        }
      }
    ]
  }

  stageInstance.setOption(option)
}

// Обновление графиков
const updateCharts = () => {
  if (funnelInstance && hasData.value) {
    const stageStats = STAGES.map(stage => ({
      name: stage.label,
      value: props.candidates.filter(c => c.stage === stage.id).length,
      itemStyle: {
        color: StageColors[stage.id]
      }
    })).filter(item => item.value > 0)
    
    funnelInstance.setOption({
      series: [{
        data: stageStats
      }]
    })
  }
  
  if (stageInstance && hasData.value) {
    const stageData = STAGES.map(stage => ({
      name: stage.label,
      value: props.candidates.filter(c => c.stage === stage.id).length
    }))
    
    stageInstance.setOption({
      xAxis: {
        data: stageData.map(item => item.name)
      },
      series: [{
        data: stageData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: StageColors[STAGES[index].id] || '#3B82F6'
          }
        }))
      }]
    })
  }
}

// Изменение размера графиков
const resizeCharts = () => {
  if (funnelInstance) funnelInstance.resize()
  if (stageInstance) stageInstance.resize()
}

// Инициализация при монтировании
onMounted(async () => {
  await nextTick()
  if (hasData.value) {
    initFunnelChart()
    initStageChart()
  }
  window.addEventListener('resize', resizeCharts)
})

// Очистка при размонтировании
onUnmounted(() => {
  if (funnelInstance) {
    funnelInstance.dispose()
    funnelInstance = null
  }
  if (stageInstance) {
    stageInstance.dispose()
    stageInstance = null
  }
  window.removeEventListener('resize', resizeCharts)
})

// Следим за изменением кандидатов
watch(() => props.candidates, async (newCandidates) => {
  console.log('Analytics received candidates:', newCandidates.length)
  await nextTick()
  
  if (newCandidates.length > 0) {
    if (!funnelInstance) {
      initFunnelChart()
      initStageChart()
    } else {
      updateCharts()
    }
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
:deep(.echarts-tooltip) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem !important;
  background: white !important;
  border: 1px solid #E5E7EB !important;
}
</style>