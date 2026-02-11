<template>
  <div
    :class="[
      'bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition',
      isDragging ? 'opacity-50 scale-95' : ''
    ]"
    @click="onClick"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex items-start justify-between mb-2">
      <h3 class="font-medium text-gray-900">{{ candidate.name }}</h3>
      <div v-if="candidate.tags.length > 0" class="flex gap-1">
        <span
          v-for="tag in candidate.tags.slice(0, 2)"
          :key="tag"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="space-y-1 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <Briefcase class="w-3.5 h-3.5" />
        <span class="truncate">{{ candidate.position }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Mail class="w-3.5 h-3.5" />
        <span class="truncate">{{ candidate.email }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Calendar class="w-3.5 h-3.5" />
        <span>{{ formatDate(candidate.appliedAt) }}</span>
      </div>
    </div>

    <div v-if="candidate.comments.length > 0" class="mt-2 pt-2 border-t border-gray-100">
      <p class="text-xs text-gray-500">
        {{ candidate.comments.length }} comment{{ candidate.comments.length !== 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Mail, Briefcase, Calendar } from 'lucide-vue-next'

export default {
  name: 'CandidateCardSmall',
  components: {
    Mail,
    Briefcase,
    Calendar
  },
  props: {
    candidate: {
      type: Object,
      required: true
    },
    onClick: {
      type: Function,
      required: true
    }
  },
  emits: ['drag-start'],
  setup(props, { emit }) {
    const isDragging = ref(false)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const handleDragStart = (event) => {
      isDragging.value = true
      
      // Устанавливаем данные для drag
      event.dataTransfer.setData('text/plain', props.candidate.id)
      event.dataTransfer.effectAllowed = 'move'
      
      // Эмитим событие для родительского компонента
      emit('drag-start', props.candidate.id)
      
      // Добавляем визуальную обратную связь
      event.currentTarget.style.opacity = '0.4'
    }

    const handleDragEnd = (event) => {
      isDragging.value = false
      event.currentTarget.style.opacity = '1'
    }

    return {
      isDragging,
      formatDate,
      handleDragStart,
      handleDragEnd
    }
  }
}
</script>