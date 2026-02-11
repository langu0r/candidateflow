// Утилита для работы с уведомлениями
let toastInstance = null

export const setToastInstance = (instance) => {
  toastInstance = instance
}

export const toast = {
  success: (message, duration) => {
    if (toastInstance) {
      return toastInstance.success(message, duration)
    }
    console.log('✅', message)
  },
  
  error: (message, duration) => {
    if (toastInstance) {
      return toastInstance.error(message, duration)
    }
    console.error('❌', message)
  },
  
  info: (message, duration) => {
    if (toastInstance) {
      return toastInstance.info(message, duration)
    }
    console.info('ℹ️', message)
  },
  
  warning: (message, duration) => {
    if (toastInstance) {
      return toastInstance.warning(message, duration)
    }
    console.warn('⚠️', message)
  },
  
  loading: (message) => {
    if (toastInstance) {
      return toastInstance.loading(message)
    }
    console.log('⏳', message)
  },
  
  dismiss: (id) => {
    if (toastInstance) {
      toastInstance.dismiss(id)
    }
  },
  
  promise: async (promise, options) => {
    if (toastInstance) {
      return toastInstance.promise(promise, options)
    }
    
    console.log('⏳', options.loading || 'Loading...')
    try {
      const result = await promise
      console.log('✅', options.success || 'Success!')
      return result
    } catch (error) {
      console.error('❌', options.error || 'Error!')
      throw error
    }
  }
}