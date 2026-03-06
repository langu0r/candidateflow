<!-- components/common/BaseModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50" @click.self="close">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50" />

        <!-- Modal -->
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div
              class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              :class="contentClass"
            >
              <!-- Header -->
              <div v-if="title || $slots.header" class="border-b border-gray-200 p-6">
                <slot name="header">
                  <div class="flex items-start justify-between">
                    <h2 class="text-2xl">{{ title }}</h2>
                    <button @click="close" class="text-gray-400 hover:text-gray-600">
                      <X class="w-6 h-6" />
                    </button>
                  </div>
                </slot>
              </div>

              <!-- Content -->
              <div class="overflow-y-auto" :class="contentPadding ? 'p-6' : ''">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="border-t border-gray-200 p-6">
                <slot name="footer" :close="close" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  contentClass: String,
  contentPadding: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>