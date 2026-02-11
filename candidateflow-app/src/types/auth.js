// Типы пользователей
export const UserRole = {
  RECRUITER: 'recruiter',
  ADMIN: 'admin'
}

// Схема пользователя
export const UserSchema = {
  id: '',
  email: '',
  name: '',
  role: UserRole.RECRUITER,
  createdAt: new Date()
}

// Вспомогательные функции для аутентификации
export const AuthUtils = {
  // Проверка авторизации
  isAuthenticated: () => {
    return !!localStorage.getItem('currentUser')
  },

  // Получение текущего пользователя
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  },

  // Выход из системы
  logout: () => {
    localStorage.removeItem('currentUser')
  }
}