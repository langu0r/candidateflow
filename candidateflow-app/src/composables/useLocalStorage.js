// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, initialValue = null) {
  const storedValue = localStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : initialValue)

  watch(data, (newValue) => {
    if (newValue === null || newValue === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })

  const remove = () => {
    data.value = null
  }

  return {
    data,
    remove
  }
}