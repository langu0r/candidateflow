<!-- components/ApplicationForm.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
      <template v-if="submitted">
        <SuccessScreen @reset="resetForm" />
      </template>

      <template v-else>
        <h1 class="text-3xl mb-2">Join Our Team</h1>
        <p class="text-gray-600 mb-8">Fill out the form below to apply for a position.</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- First Name -->
          <FormField
            v-model="form.first_name"
            label="First Name *"
            :error="errors.first_name"
            placeholder="John"
            required
          />

          <!-- Last Name -->
          <FormField
            v-model="form.last_name"
            label="Last Name *"
            :error="errors.last_name"
            placeholder="Doe"
            required
          />

          <!-- Email -->
          <FormField
            v-model="form.email"
            label="Email Address *"
            type="email"
            :error="errors.email"
            placeholder="john@example.com"
            required
          />

          <!-- Phone -->
          <FormField
            v-model="form.phone"
            label="Phone Number *"
            type="tel"
            :error="errors.phone"
            placeholder="+1 (555) 123-4567"
            required
          />

          <!-- Position -->
          <FormSelect
            v-model="form.position_id"
            label="Position Applied For *"
            :options="positionOptions"
            :error="errors.position_id"
            :loading="positionsLoading"
            required
          />

          <!-- CV Upload -->
          <FileUpload
            v-model="cvFile"
            label="Upload CV *"
            accept=".pdf,.doc,.docx"
            :max-size="5 * 1024 * 1024"
            :error="errors.cv"
            @error="handleUploadError"
          />

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting || positionsLoading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <LoadingSpinner v-if="isSubmitting" size="sm" />
            <span v-else>Submit Application</span>
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm } from '../composables/useForm'
import { useApi } from '../composables/useApi'
import { fetchPositions } from '../api/positions'
import { useCandidatesStore } from '../stores/candidates'
import FormField from './common/FormField.vue'
import FormSelect from './common/FormSelect.vue'
import FileUpload from './common/FileUpload.vue'
import LoadingSpinner from './common/LoadingSpinner.vue'
import SuccessScreen from './SuccessScreen.vue'

const store = useCandidatesStore()
const submitted = ref(false)
const cvFile = ref(null)

// Загрузка позиций
const { data: positions, loading: positionsLoading, execute: loadPositions } = useApi(fetchPositions)

onMounted(() => {
  loadPositions()
})

const positionOptions = computed(() =>
  (positions.value || []).map(p => ({
    value: p.position_id,
    label: `${p.title} (${p.department})`
  }))
)

// Валидация
const validationRules = {
  first_name: {
    required: true,
    minLength: 2,
    requiredMessage: 'First name is required'
  },
  last_name: {
    required: true,
    minLength: 2,
    requiredMessage: 'Last name is required'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Invalid email format'
  },
  phone: {
    required: true,
    pattern: /^[\d\s\-+()]{10,}$/,
    patternMessage: 'Invalid phone format'
  },
  position_id: {
    required: true,
    custom: (value) => {
      if (!value || value <= 0) return 'Please select a position'
    }
  }
}

const {
  formData: form,
  errors,
  isSubmitting,
  submit
} = useForm({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position_id: ''
}, validationRules)

// Обработка отправки
const handleSubmit = async () => {
  if (!cvFile.value) {
    errors.value.cv = ['Please upload your CV']
    return
  }
  if (isSubmitting.value) return // защита от двойного нажатия

  isSubmitting.value = true
  const selectedPosition = positions.value.find(p => p.position_id === form.position_id)

  const reader = new FileReader()
  reader.onloadend = () => {
    // Если файл вдруг пропал – не отправляем
    if (!cvFile.value) {
      isSubmitting.value = false
      return
    }

    store.createCandidate({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      position_id: form.position_id,
      position_title: selectedPosition?.title,
      cv: {
        original_name: cvFile.value.name,
        file_size: cvFile.value.size,
        mime_type: cvFile.value.type,
        file_data: reader.result
      }
    }).catch(err => console.warn('Background error:', err))

    submitted.value = true
    isSubmitting.value = false
  }
  reader.readAsDataURL(cvFile.value)
}

const handleUploadError = (error) => {
  errors.value.cv = [error]
}

const resetForm = () => {
  submitted.value = false
  form.first_name = ''
  form.last_name = ''
  form.email = ''
  form.phone = ''
  form.position_id = ''
  cvFile.value = null
}
</script>