<!-- components/common/FileUpload.vue -->
<template>
  <div>
    <label class="block text-sm mb-2 text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
      :class="[
        error ? 'border-red-300' : 'border-gray-300',
        isDragging ? 'border-blue-400 bg-blue-50' : ''
      ]"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileChange"
      />
      
      <Upload class="w-12 h-12 text-gray-400 mx-auto mb-2" />
      
      <p v-if="modelValue" class="text-green-600">
        {{ modelValue.name }}
      </p>
      <template v-else>
        <p class="text-gray-600">Click to upload or drag and drop</p>
        <p class="text-sm text-gray-400 mt-1">
          {{ accept.split(',').join(', ') }} (max {{ formatFileSize(maxSize) }})
        </p>
      </template>
    </div>
    
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

const props = defineProps({
  modelValue: File,
  label: String,
  accept: {
    type: String,
    default: '.pdf,.doc,.docx'
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  required: Boolean,
  error: [String, Array]
})

const emit = defineEmits(['update:modelValue', 'error'])

const fileInput = ref(null)
const isDragging = ref(false)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  validateAndSetFile(e.target.files?.[0])
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  validateAndSetFile(e.dataTransfer.files?.[0])
}

const validateAndSetFile = (file) => {
  if (!file) return

  // Проверка размера
  if (file.size > props.maxSize) {
    emit('error', `File size must be less than ${formatFileSize(props.maxSize)}`)
    return
  }

  // Проверка типа
  const acceptedTypes = props.accept.split(',').map(t => t.trim().toLowerCase())
  const fileExt = '.' + file.name.split('.').pop().toLowerCase()
  
  if (!acceptedTypes.some(type => type === fileExt || type === file.type)) {
    emit('error', `Please upload a file of type: ${props.accept}`)
    return
  }

  emit('update:modelValue', file)
  emit('error', null)
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
</script>