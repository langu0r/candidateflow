// api/tags.js
import { api } from './client'
import { normalizeTag } from './normalizers'

/**
 * Получить все теги
 * @returns {Promise<Array>}
 */
export const fetchTags = async () => {
  const data = await api.get('/tags')
  return (Array.isArray(data) ? data : []).map(normalizeTag)
}

/**
 * Создать тег
 * @param {Object} tagData
 * @returns {Promise<Object>}
 */
export const createTag = async (tagData) => {
  const response = await api.post('/tags', {
    name: tagData.name,
    color: tagData.color
  })
  return normalizeTag(response)
}

/**
 * Добавить тег кандидату
 * @param {number} candidateId
 * @param {number} tagId
 * @returns {Promise<void>}
 */
export const addTagToCandidate = async (candidateId, tagId) => {
  return api.post(`/tags/${tagId}/add/${candidateId}`, {})
}

/**
 * Удалить тег у кандидата
 * @param {number} candidateId
 * @param {number} tagId
 * @returns {Promise<void>}
 */
export const removeTagFromCandidate = async (candidateId, tagId) => {
  return api.delete(`/tags/${tagId}/remove/${candidateId}`)
}

/**
 * Получить теги кандидата
 * @param {number} candidateId
 * @returns {Promise<Array>}
 */
export const fetchCandidateTags = async (candidateId) => {
  const data = await api.get(`/tags/candidate/${candidateId}`)
  return (Array.isArray(data) ? data : []).map(normalizeTag)
}