<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <UserPlus class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl mb-2">Create Account</h1>
        <p class="text-gray-600">Join as a recruiter to manage candidates</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Full Name -->
        <div>
          <label class="block text-sm mb-2 text-gray-700">Full Name</label>
          <div class="relative">
            <UserIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              v-model="formData.name"
              class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm mb-2 text-gray-700">Email Address</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              required
              v-model="formData.email"
              class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="recruiter@company.com"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm mb-2 text-gray-700">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              :type="showPassword ? 'text' : 'password'"
              required
              v-model="formData.password"
              class="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm mb-2 text-gray-700">Confirm Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              v-model="formData.confirmPassword"
              class="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating account...
          </span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?{' '}
          <router-link
            to="/login"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </router-link>
        </p>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200 text-center">
        <p class="text-sm text-gray-500">
          By creating an account, you agree to manage recruitment processes responsibly.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserPlus, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-vue-next'
import { useToast } from '../composables/useToast'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['register'])

const toast = useToast()

// Состояние формы
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Отправка формы
const handleSubmit = () => {
  // Валидация
  if (formData.value.password !== formData.value.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }

  if (formData.value.password.length < 6) {
    toast.error('Password must be at least 6 characters')
    return
  }

  emit('register', formData.value.email, formData.value.password, formData.value.name)
}
</script>