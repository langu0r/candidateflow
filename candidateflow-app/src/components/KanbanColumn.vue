<template>
  <div
    :class="[
      'flex-shrink-0 w-80 rounded-lg border-2 p-4 transition',
      StageBgColors[stage.id] || 'bg-gray-50 border-gray-200',
      isDragOver ? 'ring-2 ring-blue-400 bg-opacity-80' : ''
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Заголовок колонки -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-medium text-gray-900">{{ stage.label }}</h3>
      <span class="bg-white px-2 py-1 rounded text-sm text-gray-600">
        {{ candidates.length }}
      </span>
    </div>

    <!-- Список кандидатов -->
    <div class="space-y-3 min-h-[200px]">
      <CandidateCardSmall
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        @click="$emit('candidate-click', candidate)"
      />
      
      <!-- Пустое состояние колонки -->
      <div v-if="candidates.length === 0" class="text-center py-8 text-gray-400 text-sm">
        Drop candidate here
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { StageBgColors } from '../constants/stages'
import CandidateCardSmall from './CandidateCardSmall.vue'

const props = defineProps({
  stage: {
    type: Object,
    required: true
  },
  candidates: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['drop', 'candidate-click'])

// Состояние перетаскивания
const isDragOver = ref(false)

// Обработка наведения с перетаскиваемым элементом
const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

// Обработка ухода перетаскиваемого элемента
const handleDragLeave = () => {
  isDragOver.value = false
}

// Обработка сброса
const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  // Получаем ID кандидата из dataTransfer
  const candidateId = event.dataTransfer.getData('text/plain')
  
  if (candidateId) {
    emit('drop', candidateId, props.stage.id)
  }
}
</script>