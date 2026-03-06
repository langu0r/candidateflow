<!-- components/common/DocumentCard.vue -->
<template>
  <div class="border-t border-gray-200 pt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg">{{ title }}</h3>
      <button
        @click="$emit('download')"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Download class="w-4 h-4" />
        Download
      </button>
    </div>
    <div class="bg-gray-50 rounded-lg p-4">
      <p class="text-gray-700">{{ document.originalName }}</p>
      <p class="text-xs text-gray-500 mt-1">
        Uploaded {{ formatDate(document.uploadedAt) }}
        ({{ formatFileSize(document.fileSize) }})
      </p>
    </div>
  </div>
</template>

<script setup>
import { Download } from 'lucide-vue-next'

const props = defineProps({
  document: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: 'Document'
  }
})

defineEmits(['download'])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
</script>