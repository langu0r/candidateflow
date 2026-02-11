<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <LogIn class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl mb-2">Welcome Back</h1>
        <p class="text-gray-600">Sign in to your recruiter account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
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

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Sign In
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have an account?{' '}
          <button
            @click="$emit('switch-to-register')"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create account
          </button>
        </p>
      </div>

      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800 mb-2">
          <strong>Demo Credentials:</strong>
        </p>
        <p class="text-sm text-blue-700">
          Email: demo@recruiter.com<br />
          Password: demo123
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { toast } from '../utils/toast'

export default {
  name: 'LoginForm',
  components: {
    LogIn,
    Mail,
    Lock,
    Eye,
    EyeOff
  },
  props: {
    onLogin: {
      type: Function,
      required: true
    },
    onSwitchToRegister: {
      type: Function,
      required: true
    }
  },
  emits: ['login', 'switch-to-register'],
  setup(props, { emit }) {
    const formData = ref({
      email: '',
      password: ''
    })
    const showPassword = ref(false)

    const handleSubmit = () => {
      emit('login', formData.value.email, formData.value.password)
    }

    return {
      formData,
      showPassword,
      handleSubmit
    }
  }
}
</script>