<!-- components/common/TabButton.vue -->
<template>
  <button
    :class="[
      'py-3 border-b-2 transition font-medium',
      active
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-600 hover:text-gray-900'
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  active: Boolean
})

defineEmits(['click'])
</script>