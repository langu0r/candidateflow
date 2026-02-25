<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Основной контент -->
    <div class="max-w-7xl mx-auto p-6">
      <!-- Индикатор загрузки -->
      <div v-if="candidatesStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Контент в зависимости от текущего маршрута -->
      <template v-else>
        <!-- Kanban View (когда путь /admin) -->
        <div v-if="isKanbanView" class="space-y-4">
          <!-- Панель фильтров -->
          <FilterPanel
            :search-query="ui.searchQuery"
            @search-change="ui.setSearchQuery"
            :selected-stages="ui.selectedStages"
            @stage-toggle="ui.toggleStage"
            :selected-tags="ui.selectedTags"
            @tag-toggle="ui.toggleTag"
            :available-tags="candidatesStore.availableTags"
            @clear-filters="ui.clearFilters"
          />

          <!-- Канбан-доска -->
          <div class="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              v-for="stage in STAGES"
              :key="stage.id"
              :stage="stage"
              :candidates="getCandidatesByStage(stage.id)"
              @drop="handleDrop"
              @candidate-click="openCandidateDetails"
            />
          </div>

          <!-- Пустое состояние -->
          <div v-if="filteredCandidates.length === 0" class="text-center py-12">
            <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg text-gray-600 mb-2">No candidates found</h3>
            <p class="text-gray-500">Try adjusting your filters or wait for new applications</p>
          </div>
        </div>

        <!-- Analytics View (когда путь /admin/analytics) -->
        <div v-else-if="isAnalyticsView">
          <Analytics 
            :key="'analytics-' + candidatesStore.items.length" 
            :candidates="candidatesStore.items" 
          />
        </div>
      </template>
    </div>

    <!-- Модальное окно деталей кандидата -->
    <CandidateDetail
      v-if="candidatesStore.selectedCandidate"
      :candidate="candidatesStore.selectedCandidate"
      @close="closeCandidateDetails"
      @add-comment="candidatesStore.addComment"
      @add-tag="candidatesStore.addTag"
      @remove-tag="candidatesStore.removeTag"
      :available-tags="candidatesStore.availableTags"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Users } from 'lucide-vue-next'
import { STAGES } from '../constants/stages'
import { useCandidatesStore } from '../stores/candidates'
import { useUIStore } from '../stores/ui'
import KanbanColumn from './KanbanColumn.vue'
import CandidateDetail from './CandidateDetail.vue'
import Analytics from './Analytics.vue'
import FilterPanel from './FilterPanel.vue'

const route = useRoute()
const candidatesStore = useCandidatesStore()
const ui = useUIStore()

// Вычисляемые свойства для определения текущего представления
const isKanbanView = computed(() => route.path === '/admin')
const isAnalyticsView = computed(() => route.path === '/admin/analytics')

// Загрузка кандидатов при монтировании
onMounted(() => {
  loadCandidates()
})

// Загрузка кандидатов
const loadCandidates = async () => {
  await candidatesStore.fetchCandidates()
}

// Фильтрация кандидатов
const filteredCandidates = computed(() => {
  if (!candidatesStore.items.length) return []
  
  return candidatesStore.items.filter(candidate => {
    // Поиск по тексту
    const matchesSearch = !ui.searchQuery ||
      candidate.name.toLowerCase().includes(ui.searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(ui.searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(ui.searchQuery.toLowerCase())

    // Фильтр по этапам
    const matchesStage = ui.selectedStages.length === 0 || 
      ui.selectedStages.includes(candidate.stage)

    // Фильтр по тегам
    const matchesTags = ui.selectedTags.length === 0 || 
      ui.selectedTags.some(tag => candidate.tags.includes(tag))

    return matchesSearch && matchesStage && matchesTags
  })
})

// Получение кандидатов для конкретного этапа
const getCandidatesByStage = (stageId) => {
  return filteredCandidates.value.filter(c => c.stage === stageId)
}

// Обработка перемещения кандидата
const handleDrop = (candidateId, newStage) => {
  candidatesStore.moveCandidate(candidateId, newStage)
}

// Открытие деталей кандидата
const openCandidateDetails = (candidate) => {
  candidatesStore.setSelectedCandidate(candidate)
}

// Закрытие деталей кандидата
const closeCandidateDetails = () => {
  candidatesStore.setSelectedCandidate(null)
}

// Следим за изменением маршрута
watch(() => route.path, async (newPath) => {
  console.log('Route changed to:', newPath)
  
  // Если перешли на аналитику, убеждаемся что данные загружены
  if (newPath === '/admin/analytics' && candidatesStore.items.length === 0) {
    await loadCandidates()
  }
})

// Следим за изменением кандидатов для отладки
watch(() => candidatesStore.items, (newItems) => {
  console.log('Candidates updated:', newItems.length)
}, { deep: true })
</script>