<!-- components/tabs/HistoryTab.vue -->
<template>
  <div class="space-y-3">
    <LoadingSpinner v-if="loading" size="sm" />
    
    <div v-else-if="!history.length" class="text-center py-8 text-gray-500">
      <Clock class="w-12 h-12 mx-auto mb-2 text-gray-300" />
      <p>No history yet</p>
    </div>

    <TransitionGroup name="slide">
      <div
        v-for="entry in sortedHistory"
        :key="entry.id"
        class="flex gap-4 pb-3 border-b border-gray-200 last:border-0"
      >
        <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
        <div class="flex-1">
          <p class="text-gray-900">{{ entry.action }}</p>
          <p class="text-sm text-gray-600">{{ entry.details }}</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDateTime(entry.createdAt) }} by {{ entry.performedByName }}
          </p>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import LoadingSpinner from '../common/LoadingSpinner.vue'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

const sortedHistory = computed(() => {
  return [...props.history].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

const formatDateTime = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-active {
  position: absolute;
}
</style>