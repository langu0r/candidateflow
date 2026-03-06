<!-- components/common/Tag.vue -->
<template>
  <span
    class="inline-flex items-center gap-1 rounded"
    :class="[sizeClasses, colorClasses, { 'px-2 py-1': !noPadding }]"
    :style="customStyle"
  >
    <slot>{{ tag }}</slot>
    <button
      v-if="removable"
      @click="$emit('remove')"
      class="hover:opacity-75"
      :aria-label="`Remove tag ${tag}`"
    >
      <X class="w-3 h-3" />
    </button>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  tag: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md'].includes(value)
  },
  removable: Boolean,
  customColor: String,
  noPadding: Boolean
})

defineEmits(['remove'])

const colorClassesMap = {
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700'
}

const sizeClassesMap = {
  sm: 'text-xs',
  md: 'text-sm'
}

const colorClasses = computed(() => {
  if (props.customColor) return ''
  return colorClassesMap[props.color] || colorClassesMap.blue
})

const sizeClasses = computed(() => {
  return sizeClassesMap[props.size] || sizeClassesMap.md
})

const customStyle = computed(() => {
  if (!props.customColor) return {}
  return {
    backgroundColor: `${props.customColor}20`,
    color: props.customColor,
    borderColor: props.customColor
  }
})
</script>