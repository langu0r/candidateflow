<!-- components/common/FormSelect.vue -->
<template>
  <div>
    <label class="block text-sm mb-2 text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :required="required"
      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :class="[
        error ? 'border-red-300' : 'border-gray-300'
      ]"
    >
      <option value="" disabled>Select an option</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <div v-if="loading" class="mt-1 text-sm text-gray-500">
      Loading...
    </div>
    
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: {
    type: Array,
    default: () => []
  },
  required: Boolean,
  error: [String, Array],
  loading: Boolean
})

defineEmits(['update:modelValue'])
</script>