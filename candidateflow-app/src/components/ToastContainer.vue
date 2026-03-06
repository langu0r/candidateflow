<!-- components/ToastContainer.vue -->
<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'rounded-lg p-4 shadow-lg border transition-all duration-300',
          toastClasses[toast.type]
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Иконки -->
            <LoadingSpinner v-if="toast.type === 'loading'" size="sm" />
            <CheckCircle v-else-if="toast.type === 'success'" class="w-5 h-5" />
            <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
            <AlertCircle v-else-if="toast.type === 'warning'" class="w-5 h-5" />
            <Info v-else class="w-5 h-5" />
            
            <p class="font-medium">{{ toast.message }}</p>
          </div>
          
          <button
            v-if="toast.type !== 'loading'"
            @click="toastManager.dismiss(toast.id)"
            class="ml-4 hover:opacity-75"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-vue-next'
import LoadingSpinner from './common/LoadingSpinner.vue'
import { toast as toastManager, setGlobalToast } from '../composables/useToast'

const toasts = ref([])

const toastClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  loading: 'bg-gray-50 border-gray-200 text-gray-800'
}

let unsubscribe

onMounted(() => {
  // Устанавливаем глобальную ссылку
  setGlobalToast(toastManager)
  
  // Подписываемся на изменения
  unsubscribe = toastManager.toasts
  toasts.value = toastManager.toasts.value
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Экспонируем менеджер для родительского компонента
defineExpose({ toast: toastManager })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>