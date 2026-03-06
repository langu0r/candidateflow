// stores/candidates.js
import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import * as api from '../api/candidates'
import * as tagsApi from '../api/tags'
import * as commentsApi from '../api/comments'
import * as historyApi from '../api/history'
import { useToast } from '../composables/useToast'
import { useLocalStorage } from '../composables/useLocalStorage'

const CACHE_TTL = 5 * 60 * 1000 // 5 минут

export const useCandidatesStore = defineStore('candidates', () => {
  const toast = useToast()

  // Состояние - используем shallowRef для больших массивов
  const items = shallowRef([])
  const selectedCandidate = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  // Кэш для отдельных кандидатов
  const candidateCache = new Map()

  // Кэш для связанных данных
  const commentsCache = new Map()
  const historyCache = new Map()

  // Геттеры с мемоизацией
  const candidatesMap = computed(() => {
    const map = new Map()
    items.value.forEach(c => map.set(c.candidate_id, c))
    return map
  })

  const candidatesByStage = computed(() => {
    const map = new Map()
    items.value.forEach(candidate => {
      const stage = candidate.stage
      if (!map.has(stage)) {
        map.set(stage, [])
      }
      map.get(stage).push(candidate)
    })
    return map
  })

  const availableTags = computed(() => {
    const tagsSet = new Set()
    items.value.forEach(candidate => {
      candidate.tags?.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  })

  const stats = computed(() => ({
    total: items.value.length,
    byStage: Object.fromEntries(candidatesByStage.value),
    hired: items.value.filter(c => c.stage === 'hired').length,
    rejected: items.value.filter(c => c.stage === 'rejected').length
  }))

  // Методы работы с кэшем
  const isCacheValid = () => {
    return lastFetch.value && Date.now() - lastFetch.value < CACHE_TTL
  }

  const invalidateCache = () => {
    lastFetch.value = null
    candidateCache.clear()
    commentsCache.clear()
    historyCache.clear()
  }

  // Загрузка кандидатов
  const fetchCandidates = async (force = false) => {
    if (!force && isCacheValid()) {
      console.log('📦 Using cached candidates')
      return items.value
    }

    loading.value = true
    error.value = null

    try {
      const candidates = await api.fetchCandidates()
      items.value = candidates
      lastFetch.value = Date.now()

      // Кэшируем каждого кандидата
      candidates.forEach(c => candidateCache.set(c.candidate_id, c))

      console.log(`✅ Loaded ${candidates.length} candidates`)
      return candidates
    } catch (err) {
      error.value = err.message
      toast.error('Failed to load candidates')
      throw err
    } finally {
      loading.value = false
    }
  }

  // Загрузка одного кандидата с кэшем
  const loadCandidateById = async (id, force = false) => {
    if (!force && candidateCache.has(id)) {
      selectedCandidate.value = candidateCache.get(id)
      return selectedCandidate.value
    }

    loading.value = true

    try {
      const candidate = await api.fetchCandidateById(id)
      candidateCache.set(id, candidate)

      // Обновляем в общем списке если есть
      const index = items.value.findIndex(c => c.candidate_id === id)
      if (index !== -1) {
        items.value[index] = candidate
      }

      selectedCandidate.value = candidate
      return candidate
    } catch (err) {
      toast.error('Failed to load candidate details')
      throw err
    } finally {
      loading.value = false
    }
  }

  // Загрузка комментариев по требованию
  const loadCandidateComments = async (candidateId, force = false) => {
    if (!force && commentsCache.has(candidateId)) {
      return commentsCache.get(candidateId)
    }

    try {
      const comments = await commentsApi.fetchComments(candidateId)
      commentsCache.set(candidateId, comments)

      // Обновляем в кандидате
      const candidate = candidatesMap.value.get(candidateId)
      if (candidate) {
        candidate.comments = comments
      }

      return comments
    } catch (err) {
      console.error('Failed to load comments:', err)
      return []
    }
  }

  // Загрузка истории по требованию
  const loadCandidateHistory = async (candidateId, force = false) => {
    if (!force && historyCache.has(candidateId)) {
      return historyCache.get(candidateId)
    }

    try {
      const history = await historyApi.fetchCandidateHistory(candidateId)
      historyCache.set(candidateId, history)

      const candidate = candidatesMap.value.get(candidateId)
      if (candidate) {
        candidate.history = history
      }

      return history
    } catch (err) {
      console.error('Failed to load history:', err)
      return []
    }
  }

  // Перемещение кандидата с оптимистичным обновлением
  const moveCandidate = async (id, newStage) => {
    const candidateId = Number(id)
    const candidate = candidatesMap.value.get(candidateId)

    if (!candidate) {
      console.error('Candidate not found:', candidateId)
      return
    }

    const oldStage = candidate.stage
    if (oldStage === newStage) return

    // Оптимистичное обновление
    const previousItems = [...items.value]
    items.value = items.value.map(c =>
      c.candidate_id === candidateId ? { ...c, stage: newStage } : c
    )

    if (selectedCandidate.value?.candidate_id === candidateId) {
      selectedCandidate.value = { ...selectedCandidate.value, stage: newStage }
    }

    try {
      const updated = await api.updateCandidate(candidateId, { stage: newStage })

      // Обновляем кэш
      candidateCache.set(candidateId, { ...candidate, ...updated, stage: newStage })

      toast.success(`Moved to ${newStage}`)

      // Создаем запись в истории (fire and forget)
      historyApi.createHistoryEntry({
        candidate_id: candidateId,
        action_type: 'STAGE_CHANGED',
        performed_by: getCurrentUserId()
      }).catch(console.warn)

      return updated
    } catch (err) {
      // Откат при ошибке
      items.value = previousItems
      if (selectedCandidate.value?.candidate_id === candidateId) {
        selectedCandidate.value = candidate
      }

      toast.error(`Failed to move: ${err.message}`)
      throw err
    }
  }

  // Создание кандидата
const createNewCandidate = async (data) => {
  // Валидация на фронте — не даём отправить пустые данные
  if (!data.first_name || !data.last_name || !data.email || !data.position_id) {
    toast.error('Missing required fields')
    return
  }

  loading.value = true
  try {
    const newCandidate = await api.createCandidate(data)
    
    items.value = [newCandidate, ...items.value]
    candidateCache.set(newCandidate.candidate_id, newCandidate)

    if (data.cv?.file_data) {
      const file = dataURLtoFile(data.cv.file_data, data.cv.original_name)
      api.uploadCandidateCV(newCandidate.candidate_id, file).catch(console.warn)
    }

    toast.success('Application submitted successfully!')
    return newCandidate
  } catch (err) {
    toast.error(err.message || 'Failed to create candidate')
    throw err
  } finally {
    loading.value = false
  }
}

  // Добавление комментария
  const addComment = async (candidateId, content) => {
    try {
      const comment = await commentsApi.createComment({
        candidate_id: candidateId,
        user_id: getCurrentUserId(),
        content
      })

      // Обновляем кэш комментариев
      const comments = commentsCache.get(candidateId) || []
      commentsCache.set(candidateId, [comment, ...comments])

      // Обновляем кандидата
      const candidate = candidatesMap.value.get(candidateId)
      if (candidate) {
        candidate.comments = [comment, ...(candidate.comments || [])]
      }

      if (selectedCandidate.value?.candidate_id === candidateId) {
        selectedCandidate.value.comments = [comment, ...(selectedCandidate.value.comments || [])]
      }

      toast.success('Comment added')
      return comment
    } catch (err) {
      toast.error('Failed to add comment')
      throw err
    }
  }

  // Добавление тега (исправлено под Postman)
  const addTag = async (candidateId, tagName) => {
    try {
      // Сначала создаем тег или получаем существующий
      let tagId
      const existingTag = await tagsApi.fetchTags().then(tags =>
        tags.find(t => t.name === tagName)
      )

      if (existingTag) {
        tagId = existingTag.tag_id
      } else {
        const newTag = await tagsApi.createTag({ name: tagName, color: '#3B82F6' })
        tagId = newTag.tag_id
      }

      // Добавляем тег кандидату (исправленный URL)
      await tagsApi.addTagToCandidate(candidateId, tagId)

      // Обновляем UI
      const candidate = candidatesMap.value.get(candidateId)
      if (candidate) {
        candidate.tags = [...new Set([...candidate.tags, tagName])]
      }

      if (selectedCandidate.value?.candidate_id === candidateId) {
        selectedCandidate.value.tags = [...new Set([...selectedCandidate.value.tags, tagName])]
      }

      toast.success('Tag added')
    } catch (err) {
      toast.error('Failed to add tag')
      throw err
    }
  }

  // Удаление тега (исправлено под Postman)
  const removeTag = async (candidateId, tagName) => {
    try {
      // Находим ID тега
      const tags = await tagsApi.fetchTags()
      const tag = tags.find(t => t.name === tagName)

      if (!tag) return

      // Удаляем тег (исправленный URL)
      await tagsApi.removeTagFromCandidate(candidateId, tag.tag_id)

      // Обновляем UI
      const candidate = candidatesMap.value.get(candidateId)
      if (candidate) {
        candidate.tags = candidate.tags.filter(t => t !== tagName)
      }

      if (selectedCandidate.value?.candidate_id === candidateId) {
        selectedCandidate.value.tags = selectedCandidate.value.tags.filter(t => t !== tagName)
      }

      toast.success('Tag removed')
    } catch (err) {
      toast.error('Failed to remove tag')
      throw err
    }
  }

  // Утилиты
  const getCurrentUserId = () => {
    try {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user).user_id : null
    } catch {
      return null
    }
  }

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  const setSelectedCandidate = (candidate) => {
    selectedCandidate.value = candidate
  }

  return {
    // Состояние
    items,
    selectedCandidate,
    loading,
    error,

    // Геттеры
    availableTags,
    candidatesByStage,
    stats,

    // Методы
    fetchCandidates,
    loadCandidateById,
    loadCandidateComments,
    loadCandidateHistory,
    moveCandidate,
    createCandidate: createNewCandidate,
    addComment,
    addTag,
    removeTag,
    setSelectedCandidate,
    invalidateCache
  }
})