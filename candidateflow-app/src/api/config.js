// Базовый URL API
export const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:5000' 
  : '/api'  // для разработки используем proxy

// Таймаут для запросов (мс)
export const API_TIMEOUT = 10000

// Функция для получения заголовков с авторизацией
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

// Функция для обработки ответов
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}