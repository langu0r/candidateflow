import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, register as apiRegister, getUserById } from '../api/auth'
import { getToast } from '../utils/toast'

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Получаем тост (без использования composable для избежания циклических зависимостей)
  const toast = getToast()
  
  /**
   * Загрузка пользователя из localStorage
   */
  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse saved user')
        localStorage.removeItem('currentUser')
      }
    }
  }
  
  /**
   * Вход в систему
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const userData = await apiLogin(email, password)
      user.value = userData
      localStorage.setItem('currentUser', JSON.stringify(userData))
      toast.success(`Welcome back, ${userData.name}!`)
      return userData
    } catch (err) {
      error.value = err.message
      toast.error(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Регистрация нового пользователя
   * @param {string} email
   * @param {string} password
   * @param {string} name
   */
  const register = async (email, password, name) => {
    loading.value = true
    error.value = null
    
    try {
      const userData = await apiRegister(email, password, name)
      user.value = userData
      localStorage.setItem('currentUser', JSON.stringify(userData))
      toast.success('Account created successfully!')
      return userData
    } catch (err) {
      error.value = err.message
      toast.error(err.message)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Выход из системы
   */
  const logout = () => {
    user.value = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('companyId')
    toast.success('Logged out successfully')
  }
  
  /**
   * Проверка авторизации
   */
  const checkAuth = async () => {
    if (user.value) return true
    
    const savedUser = localStorage.getItem('currentUser')
    if (!savedUser) return false
    
    try {
      const parsedUser = JSON.parse(savedUser)
      // Проверяем, что пользователь всё ещё существует в БД
      const freshUser = await getUserById(parsedUser.id)
      if (freshUser) {
        user.value = freshUser
        return true
      } else {
        localStorage.removeItem('currentUser')
        return false
      }
    } catch (e) {
      return false
    }
  }
  
  // Загружаем пользователя при создании стора
  loadUserFromStorage()
  
  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  }
})