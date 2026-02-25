<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'rounded-lg p-4 shadow-lg border transition-all duration-300 transform translate-x-0',
        toast.type === 'success' && 'bg-green-50 border-green-200 text-green-800',
        toast.type === 'error' && 'bg-red-50 border-red-200 text-red-800',
        toast.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-800',
        toast.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
        toast.type === 'loading' && 'bg-gray-50 border-gray-200 text-gray-800'
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Иконка загрузки -->
          <div 
            v-if="toast.type === 'loading'" 
            class="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"
          ></div>
          
          <!-- Иконка успеха -->
          <svg 
            v-else-if="toast.type === 'success'" 
            class="w-5 h-5 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          
          <!-- Иконка ошибки -->
          <svg 
            v-else-if="toast.type === 'error'" 
            class="w-5 h-5 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          
          <!-- Иконка предупреждения -->
          <svg 
            v-else-if="toast.type === 'warning'" 
            class="w-5 h-5 text-yellow-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          
          <!-- Иконка информации -->
          <svg 
            v-else 
            class="w-5 h-5 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <p class="font-medium">{{ toast.message }}</p>
        </div>
        
        <!-- Кнопка закрытия -->
        <button
          v-if="toast.type !== 'loading'"
          @click="removeToast(toast.id)"
          class="text-gray-400 hover:text-gray-600 ml-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Состояние
const toasts = ref([])
let toastId = 0

// Показ тоста
const showToast = (message, type = 'info', duration = 4000) => {
  const id = ++toastId
  const toast = { id, message, type }
  
  toasts.value.push(toast)
  
  if (type !== 'loading' && duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

// Удаление тоста
const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// API для тостов
const toast = {
  success: (message, duration = 4000) => showToast(message, 'success', duration),
  error: (message, duration = 4000) => showToast(message, 'error', duration),
  info: (message, duration = 3000) => showToast(message, 'info', duration),
  warning: (message, duration = 3000) => showToast(message, 'warning', duration),
  loading: (message) => showToast(message, 'loading', 0),
  dismiss: (id) => removeToast(id),
  promise: async (promise, options) => {
    const loadingId = showToast(options.loading || 'Loading...', 'loading')
    
    try {
      const result = await promise
      removeToast(loadingId)
      
      if (options.success) {
        showToast(options.success, 'success')
      }
      
      return result
    } catch (error) {
      removeToast(loadingId)
      
      if (options.error) {
        showToast(options.error, 'error')
      }
      
      throw error
    }
  }
}

// Предоставляем toast для дочерних компонентов
defineExpose({ toast })
</script>