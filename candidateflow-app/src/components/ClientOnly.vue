<template>
  <slot v-if="isClient" />
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ClientOnly',
  setup() {
    const isClient = ref(false)
    
    onMounted(() => {
      isClient.value = true
    })
    
    return { isClient }
  }
}
</script>