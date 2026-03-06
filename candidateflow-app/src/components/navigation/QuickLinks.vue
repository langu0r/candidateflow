<!-- components/navigation/QuickLinks.vue -->
<template>
  <!-- Кнопка перехода в админ-панель -->
  <div v-if="isPublicRoute && auth.user" class="fixed top-20 right-4 z-40">
    <router-link
      to="/admin"
      class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition"
    >
      <LayoutGrid class="w-4 h-4" />
      Go to Dashboard
    </router-link>
  </div>

  <!-- Кнопка возврата на форму подачи -->
  <div v-if="isAdminRoute && auth.user" class="fixed bottom-4 right-4 z-40">
    <router-link
      to="/apply"
      class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition"
    >
      <Briefcase class="w-4 h-4" />
      New Application
    </router-link>
  </div>

  <!-- Кнопка входа -->
  <div v-if="isPublicRoute && !auth.user && isApplyPage" class="fixed top-20 right-4 z-40">
    <router-link
      to="/login"
      class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 shadow-lg transition"
    >
      <LogIn class="w-4 h-4" />
      Recruiter Login
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutGrid, Briefcase, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const auth = useAuthStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isPublicRoute = computed(() => !route.path.startsWith('/admin'))
const isApplyPage = computed(() => route.path === '/apply')
</script>