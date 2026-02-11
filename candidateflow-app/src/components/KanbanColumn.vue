<template>
  <div
    :class="[
      'flex-shrink-0 w-80 rounded-lg border-2 p-4 transition',
      getColumnColor(),
      isDragOver ? 'ring-2 ring-blue-400 bg-opacity-80' : ''
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-medium text-gray-900">{{ stage.label }}</h3>
      <span class="bg-white px-2 py-1 rounded text-sm text-gray-600">
        {{ candidates.length }}
      </span>
    </div>

    <div class="space-y-3 min-h-[200px]">
      <CandidateCardSmall
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        @click="$emit('candidate-click', candidate)"
        @drag-start="handleDragStart(candidate.id)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import CandidateCardSmall from './CandidateCardSmall.vue'

export default {
  name: 'KanbanColumn',
  components: {
    CandidateCardSmall
  },
  props: {
    stage: {
      type: Object,
      required: true
    },
    candidates: {
      type: Array,
      required: true
    },
    onDrop: {
      type: Function,
      required: true
    }
  },
  emits: ['drop', 'candidate-click'],
  setup(props, { emit }) {
    const isDragOver = ref(false)
    
    // Создаем глобальное хранилище для данных drag
    const dragData = {
      candidateId: null,
      sourceStage: null
    }

    const getColumnColor = () => {
      const colors = {
        'applied': 'bg-gray-50 border-gray-200',
        'screening': 'bg-blue-50 border-blue-200',
        'interview': 'bg-purple-50 border-purple-200',
        'offer': 'bg-yellow-50 border-yellow-200',
        'hired': 'bg-green-50 border-green-200',
        'rejected': 'bg-red-50 border-red-200'
      }
      return colors[props.stage.id] || 'bg-gray-50 border-gray-200'
    }

    const handleDragStart = (candidateId) => {
      dragData.candidateId = candidateId
      dragData.sourceStage = props.stage.id
    }

    const handleDragOver = (event) => {
      event.preventDefault()
      isDragOver.value = true
      
      // Устанавливаем эффект перемещения
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }

    const handleDragLeave = () => {
      isDragOver.value = false
    }

    const handleDrop = (event) => {
      event.preventDefault()
      isDragOver.value = false
      
      if (dragData.candidateId && dragData.sourceStage !== props.stage.id) {
        emit('drop', dragData.candidateId, props.stage.id)
      }
      
      // Сбрасываем данные
      dragData.candidateId = null
      dragData.sourceStage = null
    }

    return {
      isDragOver,
      getColumnColor,
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop
    }
  }
}
</script>