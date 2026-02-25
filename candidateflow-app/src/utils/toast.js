// Глобальная ссылка на экземпляр тоста
let toastInstance = null

/**
 * Установка экземпляра тоста
 * @param {Object} instance
 */
export const setToastInstance = (instance) => {
  toastInstance = instance
}

/**
 * Получение экземпляра тоста
 */
export const getToast = () => {
  if (!toastInstance) {
    console.warn('Toast instance not initialized')
    // Возвращаем заглушку для избежания ошибок
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
  return toastInstance
}

// Экспортируем методы для удобства
export const toast = {
  success: (message, duration) => getToast().success(message, duration),
  error: (message, duration) => getToast().error(message, duration),
  info: (message, duration) => getToast().info(message, duration),
  warning: (message, duration) => getToast().warning(message, duration),
  loading: (message) => getToast().loading(message),
  dismiss: (id) => getToast().dismiss(id),
  promise: (promise, options) => getToast().promise(promise, options)
}