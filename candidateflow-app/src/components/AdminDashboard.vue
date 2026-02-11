<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl">Recruitment Dashboard</h1>
          <p class="text-gray-600 mt-1">Manage your candidates and track recruitment progress</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="activeView = 'kanban'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition',
              activeView === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <LayoutGrid class="w-4 h-4" />
            Kanban
          </button>
          <button
            @click="activeView = 'analytics'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition',
              activeView === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <BarChart3 class="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-6">
      <template v-if="activeView === 'kanban'">
        <div class="space-y-4">
          <FilterPanel
            :search-query="searchQuery"
            @search-change="setSearchQuery"
            :selected-stages="selectedStages"
            @stage-toggle="handleStageToggle"
            :selected-tags="selectedTags"
            @tag-toggle="handleTagToggle"
            :available-tags="availableTags"
            @clear-filters="handleClearFilters"
          />

          <div class="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              v-for="stage in STAGES"
              :key="stage.id"
              :stage="stage"
              :candidates="filteredCandidates.filter(c => c.stage === stage.id)"
              @drop="handleDrop"
              @candidate-click="setSelectedCandidate"
            />
          </div>

          <div v-if="filteredCandidates.length === 0" class="text-center py-12">
            <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg text-gray-600 mb-2">No candidates found</h3>
            <p class="text-gray-500">Try adjusting your filters or wait for new applications</p>
          </div>
        </div>
      </template>
      <template v-else>
        <Analytics :candidates="candidates" />
      </template>
    </div>

    <CandidateDetail
      v-if="selectedCandidate"
      :candidate="selectedCandidate"
      @close="setSelectedCandidate(null)"
      @add-comment="onAddComment"
      @add-tag="onAddTag"
      @remove-tag="onRemoveTag"
      :available-tags="availableTags"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { LayoutGrid, BarChart3, Users } from 'lucide-vue-next'
import KanbanColumn from './KanbanColumn.vue'
import CandidateDetail from './CandidateDetail.vue'
import Analytics from './Analytics.vue'
import FilterPanel from './FilterPanel.vue'
import { toast } from '../utils/toast'

const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' }
]

export default {
  name: 'AdminDashboard',
  components: {
    LayoutGrid,
    BarChart3,
    Users,
    KanbanColumn,
    CandidateDetail,
    Analytics,
    FilterPanel
  },
  props: {
    candidates: {
      type: Array,
      required: true
    },
    onUpdateCandidate: {
      type: Function,
      required: true
    },
    onMoveCandidate: {
      type: Function,
      required: true
    },
    onAddComment: {
      type: Function,
      required: true
    },
    onAddTag: {
      type: Function,
      required: true
    },
    onRemoveTag: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const selectedCandidate = ref(null)
    const activeView = ref('kanban')
    const searchQuery = ref('')
    const selectedStages = ref([])
    const selectedTags = ref([])

    const availableTags = computed(() => {
      const tags = new Set()
      props.candidates.forEach(candidate => {
        candidate.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    })

    const filteredCandidates = computed(() => {
      return props.candidates.filter(candidate => {
        const matchesSearch = !searchQuery.value ||
          candidate.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          candidate.position.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesStage = selectedStages.value.length === 0 || 
          selectedStages.value.includes(candidate.stage)

        const matchesTags = selectedTags.value.length === 0 || 
          selectedTags.value.some(tag => candidate.tags.includes(tag))

        return matchesSearch && matchesStage && matchesTags
      })
    })

    const handleDrop = (candidateId, newStage) => {
      const candidate = props.candidates.find(c => c.id === candidateId)
      if (candidate && candidate.stage !== newStage) {
        props.onMoveCandidate(candidateId, newStage)
        const stageLabel = STAGES.find(s => s.id === newStage)?.label
        toast.success(`Moved to ${stageLabel}`)
      }
    }

    const handleStageToggle = (stage) => {
      if (selectedStages.value.includes(stage)) {
        selectedStages.value = selectedStages.value.filter(s => s !== stage)
      } else {
        selectedStages.value = [...selectedStages.value, stage]
      }
    }

    const handleTagToggle = (tag) => {
      if (selectedTags.value.includes(tag)) {
        selectedTags.value = selectedTags.value.filter(t => t !== tag)
      } else {
        selectedTags.value = [...selectedTags.value, tag]
      }
    }

    const handleClearFilters = () => {
      searchQuery.value = ''
      selectedStages.value = []
      selectedTags.value = []
    }

    const setSearchQuery = (query) => {
      searchQuery.value = query
    }

    const setSelectedCandidate = (candidate) => {
      selectedCandidate.value = candidate
    }

    return {
      selectedCandidate,
      activeView,
      searchQuery,
      selectedStages,
      selectedTags,
      STAGES,
      availableTags,
      filteredCandidates,
      handleDrop,
      handleStageToggle,
      handleTagToggle,
      handleClearFilters,
      setSearchQuery,
      setSelectedCandidate
    }
  }
}
</script>