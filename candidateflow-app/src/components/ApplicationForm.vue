<template>
  <div v-if="submitted" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 class="text-2xl mb-2">Application Received!</h2>
      <p class="text-gray-600 mb-6">
        Thank you for your application. We'll review your CV and get back to you soon.
      </p>
      <button
        @click="resetForm"
        class="text-blue-600 hover:text-blue-700"
      >
        Submit another application
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
      <h1 class="text-3xl mb-2">Join Our Team</h1>
      <p class="text-gray-600 mb-8">
        Fill out the form below to apply for a position at our company.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm mb-2 text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            required
            v-model="formData.name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label class="block text-sm mb-2 text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            required
            v-model="formData.email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label class="block text-sm mb-2 text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            v-model="formData.phone"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label class="block text-sm mb-2 text-gray-700">
            Position Applied For *
          </label>
          <input
            type="text"
            required
            v-model="formData.position"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Software Engineer, Marketing Intern"
          />
        </div>

        <div>
          <label class="block text-sm mb-2 text-gray-700">
            Upload CV *
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              @change="handleFileChange"
              class="hidden"
              id="cv-upload"
            />
            <label for="cv-upload" class="cursor-pointer">
              <Upload class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p v-if="cvFile" class="text-green-600">{{ cvFile.name }}</p>
              <template v-else>
                <p class="text-gray-600">Click to upload or drag and drop</p>
                <p class="text-sm text-gray-400 mt-1">PDF, DOC, DOCX (max 5MB)</p>
              </template>
            </label>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Upload, CheckCircle } from 'lucide-vue-next'
import { toast } from '../utils/toast'

export default {
  name: 'ApplicationForm',
  components: {
    Upload,
    CheckCircle
  },
  props: {
    onSubmit: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const formData = ref({
      name: '',
      email: '',
      phone: '',
      position: ''
    })
    const cvFile = ref(null)
    const submitted = ref(false)

    const handleFileChange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB')
          return
        }
        if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
          toast.error('Please upload a PDF or DOC file')
          return
        }
        cvFile.value = file
      }
    }

    const handleSubmit = async () => {
      if (!cvFile.value) {
        toast.error('Please upload your CV')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        props.onSubmit({
          ...formData.value,
          cvFileName: cvFile.value.name,
          cvFileData: reader.result
        })
        submitted.value = true
        toast.success('Application submitted successfully!')
      }
      reader.readAsDataURL(cvFile.value)
    }

    const resetForm = () => {
      submitted.value = false
      formData.value = { name: '', email: '', phone: '', position: '' }
      cvFile.value = null
    }

    return {
      formData,
      cvFile,
      submitted,
      handleFileChange,
      handleSubmit,
      resetForm
    }
  }
}
</script>