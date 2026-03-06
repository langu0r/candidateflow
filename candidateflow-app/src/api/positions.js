// api/positions.js
import { api } from './client'
import { normalizePosition } from './normalizers'

/**
 * Получить все позиции
 * @returns {Promise<Array>}
 */
export const fetchPositions = async () => {
  const data = await api.get('/positions/')
  return (Array.isArray(data) ? data : []).map(normalizePosition)
}

/**
 * Получить позицию по ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const fetchPositionById = async (id) => {
  const data = await api.get(`/positions/${id}`)
  return normalizePosition(data)
}

/**
 * Создать новую позицию
 * @param {Object} positionData
 * @returns {Promise<Object>}
 */
export const createPosition = async (positionData) => {
  const response = await api.post('/positions/', {
    title: positionData.title,
    department: positionData.department,
    description: positionData.description,
    hiring_manager_id: positionData.hiring_manager_id
  })
  return normalizePosition(response)
}

/**
 * Обновить позицию
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updatePosition = async (id, updates) => {
  const response = await api.put(`/positions/${id}`, updates)
  return normalizePosition(response)
}

/**
 * Удалить позицию
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deletePosition = async (id) => {
  return api.delete(`/positions/${id}`)
}