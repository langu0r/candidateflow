// composables/useToast.js - ЕДИНСТВЕННЫЙ файл
import { inject, ref } from 'vue'

// Глобальная ссылка для использования вне компонентов
let globalToastInstance = null

class ToastManager {
  constructor() {
    this.toasts = ref([])
    this.id = 0
  }

  // Показать тост
  show(message, type = 'info', duration = 4000) {
    const id = ++this.id
    const toast = { id, message, type }

    this.toasts.value.push(toast)

    if (type !== 'loading' && duration > 0) {
      setTimeout(() => this.dismiss(id), duration)
    }

    return id
  }

  // Удалить тост
  dismiss(id) {
    const index = this.toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      this.toasts.value.splice(index, 1)
    }
  }

  // Успех
  success(message, duration = 4000) {
    return this.show(message, 'success', duration)
  }

  // Ошибка
  error(message, duration = 4000) {
    return this.show(message, 'error', duration)
  }

  // Инфо
  info(message, duration = 3000) {
    return this.show(message, 'info', duration)
  }

  // Предупреждение
  warning(message, duration = 3000) {
    return this.show(message, 'warning', duration)
  }

  // Загрузка
  loading(message) {
    return this.show(message, 'loading', 0)
  }

  // Promise обертка
  async promise(promise, options = {}) {
    const loadingId = this.loading(options.loading || 'Loading...')

    try {
      const result = await promise
      this.dismiss(loadingId)

      if (options.success) {
        this.success(options.success)
      }

      return result
    } catch (error) {
      this.dismiss(loadingId)

      if (options.error) {
        this.error(options.error)
      } else if (error.message) {
        this.error(error.message)
      }

      throw error
    }
  }

  // Очистить все
  clear() {
    this.toasts.value = []
  }
}

// Создаем экземпляр
const toastManager = new ToastManager()

// Устанавливаем глобальную ссылку (для использования вне компонентов)
export const setGlobalToast = (instance) => {
  globalToastInstance = instance
}

// Получить глобальный экземпляр
export const getToast = () => {
  if (!globalToastInstance) {
    console.warn('Toast not initialized, using console fallback')
    // Заглушка для избежания ошибок
    return {
      success: (msg) => console.log('✅', msg),
      error: (msg) => console.error('❌', msg),
      info: (msg) => console.log('ℹ️', msg),
      warning: (msg) => console.warn('⚠️', msg),
      loading: (msg) => console.log('⏳', msg),
      dismiss: () => {},
      promise: async (promise, options) => {
        console.log('⏳', options.loading)
        try {
          const result = await promise
          console.log('✅', options.success)
          return result
        } catch (error) {
          console.error('❌', options.error)
          throw error
        }
      }
    }
  }
  return globalToastInstance
}

// Composables для использования в компонентах
export function useToast() {
  const toast = inject('toast')
  
  if (!toast) {
    console.warn('Toast not provided, using default instance')
    return toastManager
  }
  
  return toast
}

// Экспортируем сам менеджер для прямого использования
export const toast = toastManager