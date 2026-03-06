// api/users.js
import { api } from './client'
import { normalizeUser } from './normalizers'

/**
 * Получить всех пользователей
 * @returns {Promise<Array>}
 */
export const fetchUsers = async () => {
  const data = await api.get('/users/')
  return (Array.isArray(data) ? data : []).map(normalizeUser)
}

/**
 * Получить пользователя по ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const fetchUserById = async (id) => {
  const data = await api.get(`/users/${id}`)
  return normalizeUser(data)
}

/**
 * Создать пользователя
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  const response = await api.post('/users/', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'hiring_manager'
  })
  return normalizeUser(response)
}

/**
 * Обновить пользователя
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, updates) => {
  const response = await api.put(`/users/${id}`, updates)
  return normalizeUser(response)
}

/**
 * Удалить пользователя
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`)
}