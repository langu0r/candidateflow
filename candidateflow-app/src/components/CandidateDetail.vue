<!-- components/CandidateDetail.vue -->
<template>
  <BaseModal
    :model-value="!!candidate"
    title="Candidate Details"
    @update:model-value="$emit('close')"
    content-class="max-w-4xl"
  >
    <!-- Header с информацией -->
    <template #header>
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-2xl mb-2">{{ candidate.name }}</h2>
          <div class="flex gap-2 flex-wrap">
            <Tag
              v-for="tag in candidate.tags"
              :key="tag"
              :tag="tag"
              removable
              @remove="$emit('remove-tag', candidate.candidate_id, tag)"
            />
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>
      </div>
    </template>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <div class="flex gap-4">
        <TabButton
          v-for="tab in tabs"
          :key="tab.id"
          :active="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="ml-1 text-sm">({{ tab.count }})</span>
        </TabButton>
      </div>
    </div>

    <!-- Content -->
    <div class="min-h-[400px]">
      <!-- Overview Tab -->
      <OverviewTab
        v-if="activeTab === 'overview'"
        :candidate="candidate"
        :available-tags="availableTags"
        @add-tag="handleAddTag"
      />

      <!-- Comments Tab -->
      <CommentsTab
        v-else-if="activeTab === 'comments'"
        :comments="comments"
        :loading="commentsLoading"
        @add="handleAddComment"
        @refresh="loadComments"
      />

      <!-- History Tab -->
      <HistoryTab
        v-else-if="activeTab === 'history'"
        :history="history"
        :loading="historyLoading"
        @refresh="loadHistory"
      />
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import BaseModal from './common/BaseModal.vue'
import Tag from './common/Tag.vue'
import TabButton from './common/TabButton.vue'
import OverviewTab from './tabs/OverviewTab.vue'
import CommentsTab from './tabs/CommentsTab.vue'
import HistoryTab from './tabs/HistoryTab.vue'
import { useCandidatesStore } from '../stores/candidates'

const props = defineProps({
  candidate: {
    type: Object,
    required: true
  },
  availableTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'add-comment', 'add-tag', 'remove-tag'])

const store = useCandidatesStore()
const activeTab = ref('overview')
const commentsLoading = ref(false)
const historyLoading = ref(false)
const comments = ref(props.candidate.comments || [])
const history = ref(props.candidate.history || [])

const tabs = computed(() => [
  { id: 'overview', label: 'Overview' },
  { id: 'comments', label: 'Comments', count: comments.value.length },
  { id: 'history', label: 'History', count: history.value.length }
])

// Загрузка данных по требованию
const loadComments = async () => {
  commentsLoading.value = true
  try {
    comments.value = await store.loadCandidateComments(props.candidate.candidate_id)
  } finally {
    commentsLoading.value = false
  }
}

const loadHistory = async () => {
  historyLoading.value = true
  try {
    history.value = await store.loadCandidateHistory(props.candidate.candidate_id)
  } finally {
    historyLoading.value = false
  }
}

watch(activeTab, async (newTab) => {
  if (newTab === 'comments' && comments.value.length === 0) {
    await loadComments()
  }
  if (newTab === 'history' && history.value.length === 0) {
    await loadHistory()
  }
})

const handleAddComment = (content) => {
  emit('add-comment', props.candidate.candidate_id, content)
  // Оптимистичное обновление
  comments.value = [
    {
      id: Date.now(),
      content,
      authorName: 'You',
      createdAt: new Date().toISOString()
    },
    ...comments.value
  ]
}

const handleAddTag = (tag) => {
  emit('add-tag', props.candidate.candidate_id, tag)
}
</script>