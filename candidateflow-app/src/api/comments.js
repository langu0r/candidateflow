// api/comments.js
import { api } from './client'
import { normalizeComment } from './normalizers'

/**
 * Получить комментарии кандидата
 * @param {number} candidateId
 * @returns {Promise<Array>}
 */
export const fetchComments = async (candidateId) => {
  const data = await api.get(`/comments/candidate/${candidateId}`)
  return (Array.isArray(data) ? data : []).map(normalizeComment)
}

/**
 * Создать комментарий
 * @param {Object} commentData
 * @returns {Promise<Object>}
 */
export const createComment = async (commentData) => {
  const response = await api.post('/comments', {
    candidate_id: commentData.candidate_id,
    user_id: commentData.user_id,
    content: commentData.content
  })
  return normalizeComment(response)
}

/**
 * Обновить комментарий
 * @param {number} id
 * @param {string} content
 * @returns {Promise<Object>}
 */
export const updateComment = async (id, content) => {
  const response = await api.put(`/comments/${id}`, { content })
  return normalizeComment(response)
}

/**
 * Удалить комментарий
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteComment = async (id) => {
  return api.delete(`/comments/${id}`)
}