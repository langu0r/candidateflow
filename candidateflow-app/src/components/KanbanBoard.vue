<!-- components/KanbanBoard.vue -->
<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <KanbanColumn
      v-for="stage in STAGES"
      :key="stage.id"
      :stage="stage"
      :candidates="getCandidatesForStage(stage.id)"
      @drop="handleDrop"
      @candidate-click="$emit('candidate-click', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { STAGES } from '../constants/stages'
import KanbanColumn from './KanbanColumn.vue'

const props = defineProps({
  candidates: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['drop', 'candidate-click'])

// Мемоизированное распределение по этапам
const candidatesByStage = computed(() => {
  const map = new Map()
  STAGES.forEach(stage => map.set(stage.id, []))

  props.candidates.forEach(candidate => {
    const stage = candidate.stage
    if (map.has(stage)) {
      map.get(stage).push(candidate)
    }
  })

  return map
})

const getCandidatesForStage = (stageId) => {
  return candidatesByStage.value.get(stageId) || []
}

const handleDrop = (candidateId, newStage) => {
  emit('drop', candidateId, newStage)
}
</script>