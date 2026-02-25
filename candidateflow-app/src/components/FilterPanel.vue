<template>
  <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 space-y-4">
    <!-- Заголовок с кнопкой очистки -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Filter class="w-5 h-5 text-gray-600" />
        <h3 class="font-medium text-gray-900">Filters</h3>
      </div>
      <button
        v-if="hasFilters"
        @click="$emit('clear-filters')"
        class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        <X class="w-4 h-4" />
        Clear all
      </button>
    </div>

    <!-- Поиск -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('search-change', $event.target.value)"
        placeholder="Search candidates..."
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Фильтр по этапам -->
    <div>
      <p class="text-sm text-gray-700 mb-2">Stages</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="stage in STAGES"
          :key="stage.id"
          @click="$emit('stage-toggle', stage.id)"
          :class="[
            'px-3 py-1 rounded-lg text-sm transition',
            selectedStages.includes(stage.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ stage.label }}
        </button>
      </div>
    </div>

    <!-- Фильтр по тегам -->
    <div v-if="availableTags.length > 0">
      <p class="text-sm text-gray-700 mb-2">Tags</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="$emit('tag-toggle', tag)"
          :class="[
            'px-3 py-1 rounded-lg text-sm transition',
            selectedTags.includes(tag)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Search, Filter, X } from 'lucide-vue-next'
import { STAGES } from '../constants/stages'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedStages: {
    type: Array,
    default: () => []
  },
  selectedTags: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  }
})

defineEmits(['search-change', 'stage-toggle', 'tag-toggle', 'clear-filters'])

// Проверка наличия активных фильтров
const hasFilters = computed(() => {
  return props.searchQuery || props.selectedStages.length > 0 || props.selectedTags.length > 0
})
</script>