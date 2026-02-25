import { inject } from 'vue'

/**
 * Composable для работы с тостами
 * @returns {Object} Методы для показа тостов
 */
export function useToast() {
  const toast = inject('toast')
  
  if (!toast) {
    console.error('Toast instance not provided')
    return {
      success: (msg) => console.log('Success:', msg),
      error: (msg) => console.error('Error:', msg),
      info: (msg) => console.log('Info:', msg),
      warning: (msg) => console.warn('Warning:', msg),
      loading: (msg) => console.log('Loading:', msg),
      dismiss: () => {},
      promise: async (promise, options) => {
        console.log('Loading:', options.loading)
        try {
          const result = await promise
          console.log('Success:', options.success)
          return result
        } catch (error) {
          console.error('Error:', options.error)
          throw error
        }
      }
    }
  }
  
  return toast
}