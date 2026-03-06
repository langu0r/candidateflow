<!-- components/navigation/NavLink.vue -->
<template>
  <router-link
    :to="to"
    class="px-4 py-2 rounded-lg transition flex items-center gap-2"
    :class="[
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    ]"
  >
    <component :is="iconComponent" class="w-4 h-4" />
    <slot />
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as Icons from 'lucide-vue-next'

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: String
})

const route = useRoute()

const isActive = computed(() => route.path === props.to)

const iconComponent = computed(() => {
  return props.icon ? Icons[props.icon] : null
})
</script>