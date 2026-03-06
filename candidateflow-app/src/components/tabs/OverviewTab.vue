<!-- components/tabs/OverviewTab.vue -->
<template>
  <div class="space-y-6">
    <!-- Основная информация -->
    <div class="grid grid-cols-2 gap-4">
      <InfoItem icon="Mail" :label="candidate.email" title="Email" />
      <InfoItem icon="Phone" :label="candidate.phone || 'Not provided'" title="Phone" />
      <InfoItem icon="Briefcase" :label="candidate.position" title="Position" />
      <InfoItem
        icon="Calendar"
        :label="formatDate(candidate.createdAt)"
        title="Applied"
      />
    </div>

    <!-- CV Document -->
    <DocumentCard
      v-if="candidate.cv"
      :document="candidate.cv"
      title="CV Document"
      @download="handleDownloadCV"
    />

    <!-- Add Tags -->
    <AddTagsSection
      :candidate-tags="candidate.tags"
      :available-tags="availableTags"
      @add-tag="$emit('add-tag', $event)"
    />
  </div>
</template>

<script setup>
import InfoItem from '../common/InfoItem.vue'
import DocumentCard from '../common/DocumentCard.vue'
import AddTagsSection from '../common/AddTagsSection.vue'
import { useToast } from '../../composables/useToast'

const props = defineProps({
  candidate: Object,
  availableTags: Array
})

const emit = defineEmits(['add-tag'])
const toast = useToast()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const handleDownloadCV = () => {
  toast.info('CV download - Demo only')
}
</script>