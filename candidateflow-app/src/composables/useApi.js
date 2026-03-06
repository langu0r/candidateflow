// composables/useApi.js
import { ref } from 'vue'
import { useToast } from './useToast'

export function useApi(apiFunction, options = {}) {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage = 'Operation failed'
  } = options

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const toast = useToast()

  const execute = async (...args) => {
    loading.value = true
    error.value = null

    try {
      const result = await apiFunction(...args)
      data.value = result

      if (successMessage) {
        toast.success(successMessage)
      }

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      console.error('API Error:', err)
      
      // Очищаем сообщение от HTML
      let userMessage = err.message
      
      // Если сообщение содержит HTML, показываем короткую версию
      if (userMessage.includes('<') && userMessage.includes('>')) {
        userMessage = 'Server error. Please check your data and try again.'
      }
      
      error.value = userMessage

      const message = onError?.(err) || errorMessage
      toast.error(message || userMessage)

      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute
  }
}