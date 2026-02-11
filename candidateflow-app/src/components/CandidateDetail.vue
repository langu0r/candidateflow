<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="border-b border-gray-200 p-6 flex items-start justify-between">
        <div>
          <h2 class="text-2xl mb-2">{{ candidate.name }}</h2>
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="tag in candidate.tags"
              :key="tag"
              class="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm"
            >
              {{ tag }}
              <button
                @click="onRemoveTag(candidate.id, tag)"
                class="hover:text-blue-900"
              >
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>
        <button @click="onClose" class="text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 px-6">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'py-3 border-b-2 transition',
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            Overview
          </button>
          <button
            @click="activeTab = 'comments'"
            :class="[
              'py-3 border-b-2 transition',
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            Comments ({{ candidate.comments.length }})
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'py-3 border-b-2 transition',
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            ]"
          >
            History ({{ candidate.history.length }})
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <Mail class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="text-gray-900">{{ candidate.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm text-gray-600">Phone</p>
                <p class="text-gray-900">{{ candidate.phone }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Briefcase class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm text-gray-600">Position</p>
                <p class="text-gray-900">{{ candidate.position }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Calendar class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm text-gray-600">Applied</p>
                <p class="text-gray-900">
                  {{ formatDate(candidate.appliedAt) }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg">CV Document</h3>
              <button
                @click="handleDownloadCV"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download class="w-4 h-4" />
                Download CV
              </button>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700">{{ candidate.cvFileName }}</p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg mb-3">Add Tags</h3>
            <div class="flex gap-2 mb-3 flex-wrap">
              <button
                v-for="tag in filteredTags"
                :key="tag"
                @click="handleAddTag(tag)"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              >
                + {{ tag }}
              </button>
            </div>
            <div class="flex gap-2">
              <input
                type="text"
                v-model="newTag"
                @keypress.enter="handleAddTag(newTag)"
                placeholder="Create new tag"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                @click="handleAddTag(newTag)"
                class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'comments'" class="space-y-4">
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
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </div>

          <div class="space-y-3 mt-6">
            <div v-if="candidate.comments.length === 0" class="text-center py-8 text-gray-500">
              <MessageSquare class="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No comments yet</p>
            </div>
            <div
              v-for="comment in candidate.comments"
              :key="comment.id"
              class="bg-gray-50 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-900">{{ comment.author }}</span>
                <span class="text-sm text-gray-500">
                  {{ formatDateTime(comment.timestamp) }}
                </span>
              </div>
              <p class="text-gray-700">{{ comment.text }}</p>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'history'" class="space-y-3">
          <div v-if="candidate.history.length === 0" class="text-center py-8 text-gray-500">
            <Clock class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No history yet</p>
          </div>
          <div
            v-for="entry in candidate.history"
            :key="entry.id"
            class="flex gap-4 pb-3 border-b border-gray-200 last:border-0"
          >
            <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div class="flex-1">
              <p class="text-gray-900">{{ entry.action }}</p>
              <p class="text-sm text-gray-600">{{ entry.details }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDateTime(entry.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { X, Mail, Phone, Briefcase, Calendar, Download, MessageSquare, Clock } from 'lucide-vue-next'
import { toast } from '../utils/toast'

export default {
  name: 'CandidateDetail',
  components: {
    X,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    Download,
    MessageSquare,
    Clock
  },
  props: {
    candidate: {
      type: Object,
      required: true
    },
    onClose: {
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
    },
    availableTags: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const newComment = ref('')
    const newTag = ref('')
    const activeTab = ref('overview')

    const filteredTags = computed(() => {
      return props.availableTags.filter(tag => !props.candidate.tags.includes(tag))
    })

    const handleAddComment = () => {
      if (newComment.value.trim()) {
        props.onAddComment(props.candidate.id, newComment.value)
        newComment.value = ''
        toast.success('Comment added')
      }
    }

    const handleAddTag = (tag) => {
      if (tag && !props.candidate.tags.includes(tag)) {
        props.onAddTag(props.candidate.id, tag)
        newTag.value = ''
        toast.success('Tag added')
      }
    }

    const handleDownloadCV = () => {
      toast.info('CV download - Demo only')
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleString()
    }

    return {
      newComment,
      newTag,
      activeTab,
      filteredTags,
      handleAddComment,
      handleAddTag,
      handleDownloadCV,
      formatDate,
      formatDateTime
    }
  }
}
</script>