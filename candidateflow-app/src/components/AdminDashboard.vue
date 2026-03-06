<!-- components/AdminDashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Индикатор загрузки -->
    <LoadingSpinner v-if="store.loading" />

    <template v-else>
      <div class="max-w-7xl mx-auto p-6 space-y-4">
        <!-- Панель фильтров -->
        <FilterPanel
          v-model:search="ui.searchQuery"
          v-model:stages="ui.selectedStages"
          v-model:tags="ui.selectedTags"
          :available-tags="store.availableTags"
          @clear="ui.clearFilters"
        />

        <!-- Канбан доска -->
        <KanbanBoard
          v-if="isKanbanView"
          :candidates="filteredCandidates"
          @drop="handleDrop"
          @candidate-click="openCandidateDetails"
        />

        <!-- Аналитика -->
        <Analytics
          v-else-if="isAnalyticsView"
          :candidates="store.items"
        />
      </div>
    </template>

    <!-- Модальное окно -->
    <CandidateDetail
      v-if="store.selectedCandidate"
      :candidate="store.selectedCandidate"
      :available-tags="store.availableTags"
      @close="closeCandidateDetails"
      @add-comment="store.addComment"
      @add-tag="store.addTag"
      @remove-tag="store.removeTag"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { STAGES } from '../constants/stages'  // ✅ путь правильный
import { useCandidatesStore } from '../stores/candidates'
import { useUIStore } from '../stores/ui'
import LoadingSpinner from './common/LoadingSpinner.vue'  // ✅ изменено
import FilterPanel from './FilterPanel.vue'
import KanbanBoard from './KanbanBoard.vue'  // ✅ изменено (был KanbanColumn)
import Analytics from './Analytics.vue'
import CandidateDetail from './CandidateDetail.vue'

const route = useRoute()
const store = useCandidatesStore()
const ui = useUIStore()

const { items } = storeToRefs(store)

// Вычисляемые свойства
const isKanbanView = computed(() => route.path === '/admin')
const isAnalyticsView = computed(() => route.path === '/admin/analytics')

// Фильтрация с мемоизацией
const filteredCandidates = computed(() => {
  const { searchQuery, selectedStages, selectedTags } = ui

  return items.value.filter(candidate => {
    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matches =
        candidate.name?.toLowerCase().includes(query) ||
        candidate.email?.toLowerCase().includes(query) ||
        candidate.position?.toLowerCase().includes(query)

      if (!matches) return false
    }

    // Фильтр по этапам
    if (selectedStages.length && !selectedStages.includes(candidate.stage)) {
      return false
    }

    // Фильтр по тегам
    if (selectedTags.length) {
      const hasTag = selectedTags.some(tag => candidate.tags?.includes(tag))
      if (!hasTag) return false
    }

    return true
  })
})

// Загрузка данных
onMounted(async () => {
  await store.fetchCandidates()
})

// Обработчики
const handleDrop = (candidateId, newStage) => {
  store.moveCandidate(candidateId, newStage)
}

const openCandidateDetails = (candidate) => {
  store.setSelectedCandidate(candidate)
}

const closeCandidateDetails = () => {
  store.setSelectedCandidate(null)
}

// Следим за маршрутом
watch(() => route.path, async (newPath) => {
  if ((newPath === '/admin' || newPath === '/admin/analytics') && items.value.length === 0) {
    await store.fetchCandidates()
  }
})
</script>