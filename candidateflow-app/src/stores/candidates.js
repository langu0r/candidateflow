import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  fetchCandidates as apiFetchCandidates,
  fetchCandidateById,
  createCandidate as apiCreateCandidate,
  updateCandidate as apiUpdateCandidate,
  moveCandidateStage as apiMoveCandidateStage,
  addCommentToCandidate,
  addTagToCandidateByName,
  removeTagFromCandidateByName,
  searchCandidates
} from '../api/candidates'
import { getToast } from '../utils/toast'

export const useCandidatesStore = defineStore('candidates', () => {
  const toast = getToast()
  
  // Состояние
  const items = ref([])
  const selectedCandidate = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Временное решение для получения ID текущего пользователя
  const getCurrentUserId = () => {
    try {
      const user = localStorage.getItem('currentUser')
      if (user) {
        return JSON.parse(user).id
      }
    } catch (e) {
      console.error('Failed to get current user', e)
    }
    return null
  }

  // Принудительное обновления данных:
  const refreshCandidates = async () => {
    await fetchCandidates()
  }
  
  /**
   * Загрузка всех кандидатов
   */
const fetchCandidates = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await apiFetchCandidates()
    console.log('Fetched candidates:', data)
    items.value = data
    return data
  } catch (err) {
    error.value = err.message
    toast.error('Failed to load candidates')
    console.error(err)
  } finally {
    loading.value = false
  }
}
  
  /**
   * Загрузка кандидата по ID
   * @param {string} id
   */
  const loadCandidateById = async (id) => {
    loading.value = true
    
    try {
      const candidate = await fetchCandidateById(id)
      if (candidate) {
        selectedCandidate.value = candidate
      }
      return candidate
    } catch (err) {
      toast.error('Failed to load candidate details')
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Создание нового кандидата
   * @param {Object} data
   */
  const createCandidate = async (data) => {
    loading.value = true
    
    try {
      const newCandidate = await apiCreateCandidate({
        ...data,
        uploadedById: getCurrentUserId()
      })
      
      items.value = [newCandidate, ...items.value]
      toast.success('Application submitted successfully!')
      return newCandidate
    } catch (err) {
      toast.error('Failed to submit application')
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Перемещение кандидата на новый этап
   * @param {string} id
   * @param {string} newStage
   */
  const moveCandidate = async (id, newStage) => {
    const candidate = items.value.find(c => c.id === id)
    if (!candidate) return
    
    const oldStage = candidate.stage
    if (oldStage === newStage) return
    
    // Оптимистичное обновление - кандидат должен быть только в одной колонке!
    const previousItems = [...items.value]
    
    // Обновляем только конкретного кандидата, не дублируем
    items.value = items.value.map(c => 
      c.id === id ? { ...c, stage: newStage } : c
    )
    
    try {
      const updated = await apiMoveCandidateStage(id, newStage, getCurrentUserId())
      
      // Обновляем кандидата в списке с полными данными
      items.value = items.value.map(c => 
        c.id === id ? updated : c
      )
      
      // Если открыт этот кандидат, обновляем и его
      if (selectedCandidate.value?.id === id) {
        selectedCandidate.value = updated
      }
      
      const stageLabels = {
        applied: 'Applied',
        screening: 'Screening',
        interview: 'Interview',
        offer: 'Offer',
        hired: 'Hired',
        rejected: 'Rejected'
      }
      
      toast.success(`Moved to ${stageLabels[newStage]}`)
    } catch (err) {
      // Откат при ошибке
      items.value = previousItems
      toast.error('Failed to move candidate')
      console.error(err)
    }
  }
  
  /**
   * Добавление комментария
   * @param {string} candidateId
   * @param {string} content
   */
  const addComment = async (candidateId, content) => {
    try {
      const comment = await addCommentToCandidate(candidateId, getCurrentUserId(), content)
      
      // Обновляем список комментариев у кандидата
      if (selectedCandidate.value?.id === candidateId) {
        selectedCandidate.value = {
          ...selectedCandidate.value,
          comments: [comment, ...(selectedCandidate.value.comments || [])]
        }
      }
      
      // Обновляем кандидата в общем списке
      items.value = items.value.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            comments: [comment, ...(c.comments || [])]
          }
        }
        return c
      })
      
      toast.success('Comment added')
    } catch (err) {
      toast.error('Failed to add comment')
      console.error(err)
    }
  }
  
  /**
   * Добавление тега
   * @param {string} candidateId
   * @param {string} tagName
   */
  const addTag = async (candidateId, tagName) => {
    try {
      const tags = await addTagToCandidateByName(candidateId, tagName, getCurrentUserId())
      
      // Обновляем теги у кандидата
      if (selectedCandidate.value?.id === candidateId) {
        selectedCandidate.value = {
          ...selectedCandidate.value,
          tags
        }
      }
      
      // Обновляем кандидата в общем списке
      items.value = items.value.map(c => {
        if (c.id === candidateId) {
          return { ...c, tags }
        }
        return c
      })
      
      toast.success('Tag added')
    } catch (err) {
      toast.error('Failed to add tag')
      console.error(err)
    }
  }
  
  /**
   * Удаление тега
   * @param {string} candidateId
   * @param {string} tagName
   */
  const removeTag = async (candidateId, tagName) => {
    try {
      const tags = await removeTagFromCandidateByName(candidateId, tagName, getCurrentUserId())
      
      // Обновляем теги у кандидата
      if (selectedCandidate.value?.id === candidateId) {
        selectedCandidate.value = {
          ...selectedCandidate.value,
          tags
        }
      }
      
      // Обновляем кандидата в общем списке
      items.value = items.value.map(c => {
        if (c.id === candidateId) {
          return { ...c, tags }
        }
        return c
      })
      
      toast.success('Tag removed')
    } catch (err) {
      toast.error('Failed to remove tag')
      console.error(err)
    }
  }
  
  /**
   * Выбор кандидата для просмотра деталей
   * @param {Object|null} candidate
   */
  const setSelectedCandidate = (candidate) => {
    selectedCandidate.value = candidate
  }
  
  /**
   * Поиск кандидатов с фильтрацией
   * @param {Object} filters
   */
  const search = async (filters) => {
    loading.value = true
    
    try {
      items.value = await searchCandidates(filters)
    } catch (err) {
      error.value = err.message
      toast.error('Search failed')
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Получение всех доступных тегов
   */
  const availableTags = computed(() => {
    const tagsSet = new Set()
    items.value.forEach(candidate => {
      if (candidate.tags && Array.isArray(candidate.tags)) {
        candidate.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  })
  
  /**
   * Получение кандидатов по этапу (для канбан-доски)
   * @param {string} stage
   */
  const getCandidatesByStage = (stage) => {
    return items.value.filter(c => c.stage === stage)
  }
  
  return {
    // Состояние
    items,
    selectedCandidate,
    loading,
    error,
    // Геттеры
    availableTags,
    // Действия
    fetchCandidates,
    loadCandidateById,
    createCandidate,
    moveCandidate,
    addComment,
    addTag,
    removeTag,
    setSelectedCandidate,
    search,
    // Вспомогательные методы
    getCandidatesByStage,
    refreshCandidates
  }
})