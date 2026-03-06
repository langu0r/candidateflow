<!-- components/SuccessScreen.vue -->
<template>
  <div class="text-center">
    <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
    <h2 class="text-2xl mb-2">Application Received!</h2>
    <p class="text-gray-600 mb-6">
      Thank you for your application. We'll review your CV and get back to you soon.
    </p>
    <button
      @click="$emit('reset')"
      class="text-blue-600 hover:text-blue-700"
    >
      Submit another application
    </button>
  </div>
</template>

<script setup>
import { CheckCircle } from 'lucide-vue-next'

defineEmits(['reset'])
</script>