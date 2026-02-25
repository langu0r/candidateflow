import { db, find, insert, update, delay } from './mockDb'

/**
 * @typedef {import('../types').User} User
 */

/**
 * Вход пользователя
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'passwordHash'>>}
 */
export const login = async (email, password) => {
  await delay(500)
  
  const users = find('users', { email })
  const user = users[0]
  
  if (!user || user.passwordHash !== password) {
    throw new Error('Invalid email or password')
  }
  
  // Не возвращаем хэш пароля
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Регистрация нового пользователя
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<Omit<User, 'passwordHash'>>}
 */
export const register = async (email, password, name) => {
  await delay(600)
  
  const existingUser = find('users', { email })
  if (existingUser.length > 0) {
    throw new Error('User with this email already exists')
  }
  
  const newUser = insert('users', {
    email,
    passwordHash: password, // В реальности должен быть хэш
    name,
    role: 'recruiter',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  const { passwordHash, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

/**
 * Получение текущего пользователя по ID
 * @param {string} userId
 * @returns {Promise<Omit<User, 'passwordHash'> | null>}
 */
export const getUserById = async (userId) => {
  await delay(100)
  
  const user = db.users.find(u => u.id === userId)
  if (!user) return null
  
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword
}