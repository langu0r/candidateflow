<!-- components/tabs/CommentsTab.vue -->
<template>
  <div class="space-y-4">
    <!-- Add comment form -->
    <div class="flex gap-2">
      <input
        type="text"
        v-model="newComment"
        @keypress.enter="handleAddComment"
        placeholder="Add a comment..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
      />
      <button
        @click="handleAddComment"
        :disabled="!newComment.trim() || loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Post
      </button>
    </div>

    <!-- Comments list -->
    <div class="space-y-3 mt-6">
      <LoadingSpinner v-if="loading" size="sm" />
      
      <div v-else-if="!comments.length" class="text-center py-8 text-gray-500">
        <MessageSquare class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No comments yet</p>
      </div>

      <TransitionGroup name="fade">
        <div
          v-for="comment in sortedComments"
          :key="comment.id"
          class="bg-gray-50 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-900">{{ comment.authorName }}</span>
            <span class="text-sm text-gray-500">
              {{ formatDateTime(comment.createdAt) }}
            </span>
          </div>
          <p class="text-gray-700">{{ comment.content }}</p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import LoadingSpinner from '../common/LoadingSpinner.vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

const emit = defineEmits(['add', 'refresh'])

const newComment = ref('')

const sortedComments = computed(() => {
  return [...props.comments].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

const handleAddComment = () => {
  if (newComment.value.trim()) {
    emit('add', newComment.value.trim())
    newComment.value = ''
  }
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>