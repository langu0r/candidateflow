// api/history.js
import { api } from './client'
import { normalizeHistory } from './normalizers'

/**
 * Получить историю кандидата
 * @param {number} candidateId
 * @returns {Promise<Array>}
 */
export const fetchCandidateHistory = async (candidateId) => {
  const data = await api.get(`/history/${candidateId}`)
  return (Array.isArray(data) ? data : []).map(normalizeHistory)
}

/**
 * Создать запись в истории
 * @param {Object} historyData
 * @returns {Promise<Object>}
 */
export const createHistoryEntry = async (historyData) => {
  const response = await api.post('/history', {
    candidate_id: historyData.candidate_id,
    action_type: historyData.action_type,
    performed_by: historyData.performed_by
  })
  return normalizeHistory(response)
}

/**
 * Обновить запись истории
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateHistoryEntry = async (id, updates) => {
  const response = await api.put(`/history/${id}`, {
    action_type: updates.action_type,
    performed_by: updates.performed_by
  })
  return normalizeHistory(response)
}