// api/candidates.js
import { api } from './client'
import { normalizeCandidate } from './normalizers'

/**
 * Получить всех кандидатов
 * @returns {Promise<Array>}
 */
export const fetchCandidates = async () => {
  const data = await api.get('/candidates/')
  return (Array.isArray(data) ? data : []).map(normalizeCandidate)
}

/**
 * Получить кандидата по ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const fetchCandidateById = async (id) => {
  const data = await api.get(`/candidates/${id}`)
  return normalizeCandidate(data)
}

/**
 * Создать кандидата
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createCandidate = async (data) => {
  try {
    const response = await api.post('/candidates/', {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      position_id: data.position_id
    })
    return normalizeCandidate(response)
  } catch (error) {
    // Пытаемся извлечь данные из ошибки (если это строка)
    let errorData = error.data
    if (typeof errorData === 'string') {
      try {
        errorData = JSON.parse(errorData)
      } catch {
        // не JSON
      }
    }
    if (errorData?.candidate_id) {
      console.warn('Candidate created but received error status, using response data')
      return normalizeCandidate(errorData)
    }
    throw error
  }
}

/**
 * Обновить кандидата
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateCandidate = async (id, updates) => {
  // Преобразуем stage в верхний регистр для API
  const apiUpdates = {
    ...updates,
    stage: updates.stage ? updates.stage.toUpperCase() : undefined
  }

  const response = await api.put(`/candidates/${id}`, apiUpdates)
  return normalizeCandidate(response)
}

/**
 * Загрузить CV кандидата
 * @param {number} candidateId
 * @param {File} file
 * @returns {Promise<Object>}
 */
export const uploadCandidateCV = async (candidateId, file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.postFormData(`/candidates/${candidateId}/upload-cv`, formData)
  return response
}

/**
 * Удалить кандидата
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteCandidate = async (id) => {
  return api.delete(`/candidates/${id}`)
}