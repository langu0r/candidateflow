<template>
  <div>
    <!-- Toast Container -->
    <ToastContainer ref="toastRef" />
    
    <!-- Навигационная панель (видна только в админке) -->
    <nav v-if="isAdminRoute && auth.user" class="bg-white border-b border-gray-200 px-6 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <h1 class="text-xl font-semibold text-gray-800">Recruitment Dashboard</h1>
          <div class="flex gap-2">
            <router-link 
              to="/admin" 
              class="px-4 py-2 rounded-lg transition"
              :class="[$route.path === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100']"
            >
              <LayoutGrid class="w-4 h-4 inline mr-2" />
              Candidates
            </router-link>
            <router-link 
              to="/admin/analytics" 
              class="px-4 py-2 rounded-lg transition"
              :class="[$route.path === '/admin/analytics' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100']"
            >
              <BarChart3 class="w-4 h-4 inline mr-2" />
              Analytics
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ auth.user?.name }}</span>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut class="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Кнопка перехода в админ-панель (видна на публичных страницах для авторизованных пользователей) -->
    <div v-if="isPublicRoute && auth.user" class="fixed top-4 right-4 z-50">
      <router-link
        to="/admin"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition"
      >
        <LayoutGrid class="w-4 h-4" />
        Go to Dashboard
      </router-link>
    </div>

    <!-- Кнопка возврата на форму подачи (видна в админке) -->
    <div v-if="isAdminRoute && auth.user" class="fixed bottom-4 right-4 z-50">
      <router-link
        to="/apply"
        class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition"
      >
        <Briefcase class="w-4 h-4" />
        New Application
      </router-link>
    </div>

    <!-- Кнопка входа для неавторизованных пользователей на главной -->
    <div v-if="isPublicRoute && !auth.user && $route.path === '/apply'" class="fixed top-4 right-4 z-50">
      <router-link
        to="/login"
        class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-lg transition"
      >
        <LogIn class="w-4 h-4" />
        Recruiter Login
      </router-link>
    </div>

    <!-- Основной контент -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component 
          :is="Component" 
          @login="handleLogin"
          @register="handleRegister"
          @submit="handleApplicationSubmit"
        />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutGrid, BarChart3, Briefcase, LogOut, LogIn } from 'lucide-vue-next'
import { useAuthStore } from './stores/auth'
import { useCandidatesStore } from './stores/candidates'
import { setToastInstance } from './utils/toast'
import ToastContainer from './components/ToastContainer.vue'

// Сторы
const auth = useAuthStore()
const candidatesStore = useCandidatesStore()
const route = useRoute()
const router = useRouter()

// Состояние
const toastRef = ref(null)

// Вычисляемые свойства для определения текущего маршрута
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isPublicRoute = computed(() => !route.path.startsWith('/admin'))

// Инициализация
onMounted(() => {
  // Устанавливаем экземпляр тоста
  if (toastRef.value) {
    setToastInstance(toastRef.value.toast)
    provide('toast', toastRef.value.toast)
  }
  
  // Проверяем авторизацию
  auth.checkAuth()
})

// Обработка входа
const handleLogin = async (email, password) => {
  try {
    await auth.login(email, password)
    router.push('/admin')
  } catch (error) {
    // Ошибка уже обработана в сторе
  }
}

// Обработка регистрации
const handleRegister = async (email, password, name) => {
  try {
    await auth.register(email, password, name)
    router.push('/admin')
  } catch (error) {
    // Ошибка уже обработана в сторе
  }
}

// Обработка выхода
const handleLogout = () => {
  auth.logout()
  router.push('/apply')
}

// Обработка подачи заявки
const handleApplicationSubmit = async (applicationData) => {
  await candidatesStore.createCandidate(applicationData)
}
</script>