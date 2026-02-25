<template>
  <div
    :class="[
      'bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition',
      isDragging ? 'opacity-50 scale-95' : ''
    ]"
    @click="$emit('click')"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Заголовок с именем и тегами -->
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
        <span
          v-if="candidate.tags.length > 2"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
        >
          +{{ candidate.tags.length - 2 }}
        </span>
      </div>
    </div>

    <!-- Детали кандидата -->
    <div class="space-y-1 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <Briefcase class="w-3.5 h-3.5 flex-shrink-0" />
        <span class="truncate">{{ candidate.position }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Mail class="w-3.5 h-3.5 flex-shrink-0" />
        <span class="truncate">{{ candidate.email }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Calendar class="w-3.5 h-3.5 flex-shrink-0" />
        <span>{{ formatDate(candidate.createdAt) }}</span>
      </div>
    </div>

    <!-- Индикатор комментариев -->
    <div v-if="candidate.comments?.length > 0" class="mt-2 pt-2 border-t border-gray-100">
      <p class="text-xs text-gray-500">
        {{ candidate.comments.length }} comment{{ candidate.comments.length !== 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail, Briefcase, Calendar } from 'lucide-vue-next'

const props = defineProps({
  candidate: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

// Состояние перетаскивания
const isDragging = ref(false)

// Форматирование даты
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Обработка начала перетаскивания
const handleDragStart = (event) => {
  isDragging.value = true
  
  // Устанавливаем данные для drag
  event.dataTransfer.setData('text/plain', props.candidate.id)
  event.dataTransfer.effectAllowed = 'move'
  
  // Добавляем визуальную обратную связь
  event.currentTarget.style.opacity = '0.4'
}

// Обработка окончания перетаскивания
const handleDragEnd = (event) => {
  isDragging.value = false
  event.currentTarget.style.opacity = '1'
}
</script>