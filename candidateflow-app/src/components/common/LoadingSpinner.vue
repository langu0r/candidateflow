<!-- components/common/LoadingSpinner.vue -->
<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div
      class="border-blue-600 border-t-transparent rounded-full animate-spin"
      :class="spinnerClass"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  fullPage: Boolean
})

const spinnerClass = computed(() => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }
  return sizes[props.size]
})

const containerClass = computed(() => {
  return props.fullPage ? 'min-h-screen' : ''
})
</script>