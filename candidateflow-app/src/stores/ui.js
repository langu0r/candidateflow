import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Состояние
  const activeView = ref('kanban') // 'kanban' | 'analytics'
  const searchQuery = ref('')
  const selectedStages = ref([])
  const selectedTags = ref([])
  
  /**
   * Установка активного вида
   * @param {'kanban'|'analytics'} view
   */
  const setActiveView = (view) => {
    activeView.value = view
  }
  
  /**
   * Установка поискового запроса
   * @param {string} query
   */
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }
  
  /**
   * Переключение этапа в фильтре
   * @param {string} stage
   */
  const toggleStage = (stage) => {
    if (selectedStages.value.includes(stage)) {
      selectedStages.value = selectedStages.value.filter(s => s !== stage)
    } else {
      selectedStages.value = [...selectedStages.value, stage]
    }
  }
  
  /**
   * Переключение тега в фильтре
   * @param {string} tag
   */
  const toggleTag = (tag) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter(t => t !== tag)
    } else {
      selectedTags.value = [...selectedTags.value, tag]
    }
  }
  
  /**
   * Сброс всех фильтров
   */
  const clearFilters = () => {
    searchQuery.value = ''
    selectedStages.value = []
    selectedTags.value = []
  }
  
  /**
   * Есть ли активные фильтры
   */
  const hasFilters = computed(() => {
    return searchQuery.value || selectedStages.value.length > 0 || selectedTags.value.length > 0
  })
  
  return {
    // Состояние
    activeView,
    searchQuery,
    selectedStages,
    selectedTags,
    // Геттеры
    hasFilters,
    // Действия
    setActiveView,
    setSearchQuery,
    toggleStage,
    toggleTag,
    clearFilters
  }
})