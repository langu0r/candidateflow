<!-- components/common/AddTagsSection.vue -->
<template>
  <div class="border-t border-gray-200 pt-6">
    <h3 class="text-lg mb-3">Add Tags</h3>
    
    <!-- Existing tags -->
    <div class="flex gap-2 mb-3 flex-wrap">
      <Tag
        v-for="tag in candidateTags"
        :key="tag"
        :tag="tag"
        color="blue"
      />
    </div>

    <!-- Available tags -->
    <div class="flex gap-2 mb-3 flex-wrap">
      <button
        v-for="tag in filteredTags"
        :key="tag"
        @click="$emit('add-tag', tag)"
        class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
      >
        + {{ tag }}
      </button>
    </div>

    <!-- Create new tag -->
    <div class="flex gap-2">
      <input
        type="text"
        v-model="newTag"
        @keypress.enter="handleAddNewTag"
        placeholder="Create new tag"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
      />
      <button
        @click="handleAddNewTag"
        :disabled="!newTag.trim()"
        class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tag from './Tag.vue'

const props = defineProps({
  candidateTags: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-tag'])

const newTag = ref('')

const filteredTags = computed(() => {
  return props.availableTags.filter(tag => !props.candidateTags.includes(tag))
})

const handleAddNewTag = () => {
  if (newTag.value.trim()) {
    emit('add-tag', newTag.value.trim())
    newTag.value = ''
  }
}
</script>