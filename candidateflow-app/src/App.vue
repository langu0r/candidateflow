<!-- App.vue -->
<template>
  <div>
    <ToastContainer ref="toastRef" />

    <!-- Навигация для админа -->
    <AdminNav v-if="isAdminRoute && auth.user" />

    <!-- Быстрые ссылки -->
    <QuickLinks />

    <!-- Основной контент -->
    <router-view v-slot="{ Component }">
      <Suspense>
        <component
          :is="Component"
          @login="handleLogin"
          @register="handleRegister"
          @submit="handleApplicationSubmit"
        />
        <template #fallback>
          <div class="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </template>
      </Suspense>
    </router-view>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
import { useCandidatesStore } from './stores/candidates'
import { useToast } from './composables/useToast'
import ToastContainer from './components/ToastContainer.vue'
import AdminNav from './components/navigation/AdminNav.vue'
import QuickLinks from './components/navigation/QuickLinks.vue'
import LoadingSpinner from './components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const candidatesStore = useCandidatesStore()
const { user } = storeToRefs(auth)

const toastRef = ref(null)

// Вычисляемые свойства
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Инициализация
onMounted(() => {
  if (toastRef.value) {
    // Предоставляем toast всем дочерним компонентам
    provide('toast', toastRef.value.toast)
  }
})

// Обработчики событий
const handleLogin = async (email, password) => {
  try {
    await auth.login(email, password)
    router.push('/admin')
  } catch (error) {
    // Ошибка уже обработана в сторе
  }
}

const handleRegister = async (email, password, name) => {
  try {
    await auth.register(email, password, name)
    router.push('/admin')
  } catch (error) {
    // Ошибка уже обработана в сторе
  }
}

const handleApplicationSubmit = async (data) => {
  await candidatesStore.createCandidate(data)
}
</script>