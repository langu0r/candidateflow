<!-- components/common/InfoItem.vue -->
<template>
  <div class="flex items-center gap-3">
    <component :is="iconComponent" class="w-5 h-5 text-gray-400" />
    <div>
      <p class="text-sm text-gray-600">{{ title }}</p>
      <p class="text-gray-900">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as Icons from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: String,
  label: [String, Number]
})

const iconComponent = computed(() => {
  return Icons[props.icon] || Icons.HelpCircle
})
</script>