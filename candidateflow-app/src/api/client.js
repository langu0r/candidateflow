// api/client.js
import { API_BASE_URL, getAuthHeaders } from './config'

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`, options.body)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        }
      })

      return this.handleResponse(response)
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`, { endpoint, options })
      throw this.normalizeError(error)
    }
  }

async handleResponse(response) {
  // Для 204 No Content
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')
  const isJSON = contentType?.includes('application/json')

  let data
  if (isJSON) {
    data = await response.json().catch(() => ({}))
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    // Обработка ошибок
    let errorMessage
    
    if (typeof data === 'string' && data.includes('<!doctype html>')) {
      const titleMatch = data.match(/<title>(.*?)<\/title>/)
      const errorTitle = titleMatch ? titleMatch[1] : 'Server Error'
      const traceMatch = data.match(/KeyError: '([^']+)'/)
      const keyError = traceMatch ? traceMatch[1] : ''
      
      errorMessage = keyError 
        ? `Missing field '${keyError}'` 
        : `Server error: ${errorTitle}`
    } else {
      errorMessage = data.error || data.message || data || `HTTP error ${response.status}`
    }
    
    const error = new Error(errorMessage)
    error.status = response.status
    error.data = data
    throw error
  }

  // ✅ ВАЖНО: Даже при успешном ответе, проверяем структуру данных
  // Если сервер вернул что-то неожиданное, логируем но не выбрасываем ошибку
  if (isJSON && (!data || typeof data !== 'object')) {
    console.warn('⚠️ Server returned unexpected response format:', data)
    return { id: Date.now(), ...data } // Возвращаем заглушку
  }

  return data
}

  normalizeError(error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      return new Error('Network error. Please check your connection.')
    }
    return error
  }

  // HTTP методы
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Для FormData (загрузка файлов)
  postFormData(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        // Не устанавливаем Content-Type для FormData
        ...getAuthHeaders()
      },
      body: formData
    })
  }
}

export const api = new ApiClient(API_BASE_URL)