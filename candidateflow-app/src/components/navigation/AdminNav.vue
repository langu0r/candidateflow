<!-- components/navigation/AdminNav.vue -->
<template>
  <nav class="bg-white border-b border-gray-200 px-6 py-3 relative z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-semibold text-gray-800">Recruitment Dashboard</h1>
        <div class="flex gap-2">
          <NavLink to="/admin" icon="LayoutGrid">
            Candidates
          </NavLink>
          <NavLink to="/admin/analytics" icon="BarChart3">
            Analytics
          </NavLink>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ user?.name }}</span>
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
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import NavLink from './NavLink.vue'

const router = useRouter()
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const handleLogout = () => {
  auth.logout()
  router.push('/apply')
}
</script>