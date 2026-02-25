import {
  db,
  getCollection,
  findById,
  find,
  insert,
  update,
  getCandidateWithDetails,
  getCandidateTags,
  addTagToCandidate,
  removeTagFromCandidate,
  addComment,
  addHistoryEntry,
  delay
} from './mockDb'

/**
 * @typedef {import('../types').Candidate} Candidate
 */

/**
 * Получение списка всех кандидатов с деталями
 * @returns {Promise<Array<Candidate>>}
 */
export const fetchCandidates = async () => {
  await delay(500)
  
  const candidates = getCollection('candidates')
  
  // Обогащаем каждого кандидата деталями
  const enrichedCandidates = await Promise.all(
    candidates.map(async (c) => {
      const details = await getCandidateWithDetails(c.id)
      return details
    })
  )
  
  return enrichedCandidates
}

/**
 * Получение кандидата по ID
 * @param {string} id
 * @returns {Promise<Candidate | null>}
 */
export const fetchCandidateById = async (id) => {
  await delay(200)
  return getCandidateWithDetails(id)
}

/**
 * Создание нового кандидата
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.positionId
 * @param {string} data.position
 * @param {Object} data.cv
 * @returns {Promise<Candidate>}
 */
export const createCandidate = async (data) => {
  await delay(500)
  
  const newCandidate = insert('candidates', {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    positionId: data.positionId,
    position: data.position,
    stage: 'applied',
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  // Если есть CV, создаем запись в документах
  if (data.cv) {
    insert('documents', {
      candidateId: newCandidate.id,
      fileUrl: data.cv.fileUrl || data.cv.fileData,
      fileSize: data.cv.fileSize,
      uploadedById: data.cv.uploadedById || null,
      originalName: data.cv.originalName,
      mimeType: data.cv.mimeType,
      uploadedAt: new Date()
    })
  }
  
  // Добавляем запись в историю
  addHistoryEntry(
    newCandidate.id,
    'application_received',
    null,
    'Application Received',
    `Applied for ${data.position} position`
  )
  
  return getCandidateWithDetails(newCandidate.id)
}

/**
 * Обновление данных кандидата
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Candidate>}
 */
export const updateCandidate = async (id, updates) => {
  await delay(300)
  
  const updated = update('candidates', id, updates)
  if (!updated) {
    throw new Error('Candidate not found')
  }
  
  return getCandidateWithDetails(id)
}

/**
 * Перемещение кандидата на новый этап
 * @param {string} id
 * @param {string} newStage
 * @param {string|null} userId
 * @returns {Promise<Candidate>}
 */
export const moveCandidateStage = async (id, newStage, userId = null) => {
  await delay(300)
  
  const candidate = findById('candidates', id)
  if (!candidate) {
    throw new Error('Candidate not found')
  }
  
  const oldStage = candidate.stage
  
  if (oldStage === newStage) {
    return getCandidateWithDetails(id)
  }
  
  const updated = update('candidates', id, { stage: newStage })
  
  // Добавляем запись в историю
  const stageLabels = {
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    offer: 'Offer',
    hired: 'Hired',
    rejected: 'Rejected'
  }
  
  addHistoryEntry(
    id,
    'stage_changed',
    userId,
    `Moved to ${stageLabels[newStage]}`,
    `Stage changed from ${stageLabels[oldStage]} to ${stageLabels[newStage]}`
  )
  
  return getCandidateWithDetails(id)
}

/**
 * Добавление комментария к кандидату
 * @param {string} candidateId
 * @param {string} userId
 * @param {string} content
 * @returns {Promise<Object>}
 */
export const addCommentToCandidate = async (candidateId, userId, content) => {
  await delay(200)
  
  const comment = addComment(candidateId, userId, content)
  return comment
}

/**
 * Добавление тега к кандидату
 * @param {string} candidateId
 * @param {string} tagName
 * @param {string|null} userId
 * @returns {Promise<Array<string>>}
 */
export const addTagToCandidateByName = async (candidateId, tagName, userId = null) => {
  await delay(200)
  
  // Ищем существующий тег
  let tag = find('tags', { name: tagName })[0]
  
  // Если тега нет, создаем новый
  if (!tag) {
    tag = insert('tags', {
      name: tagName,
      color: null
    })
  }
  
  addTagToCandidate(candidateId, tag.id)
  
  // Добавляем запись в историю
  addHistoryEntry(
    candidateId,
    'tag_added',
    userId,
    'Tag Added',
    `Added tag: ${tagName}`
  )
  
  const tags = getCandidateTags(candidateId)
  return tags.map(t => t.name)
}

/**
 * Удаление тега у кандидата
 * @param {string} candidateId
 * @param {string} tagName
 * @param {string|null} userId
 * @returns {Promise<Array<string>>}
 */
export const removeTagFromCandidateByName = async (candidateId, tagName, userId = null) => {
  await delay(200)
  
  const tag = find('tags', { name: tagName })[0]
  if (tag) {
    removeTagFromCandidate(candidateId, tag.id)
    
    // Добавляем запись в историю
    addHistoryEntry(
      candidateId,
      'tag_removed',
      userId,
      'Tag Removed',
      `Removed tag: ${tagName}`
    )
  }
  
  const tags = getCandidateTags(candidateId)
  return tags.map(t => t.name)
}

/**
 * Поиск кандидатов
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {Array<string>} [filters.stages]
 * @param {Array<string>} [filters.tags]
 * @returns {Promise<Array<Candidate>>}
 */
export const searchCandidates = async (filters = {}) => {
  await delay(400)
  
  const allCandidates = await fetchCandidates()
  
  return allCandidates.filter(candidate => {
    // Поиск по тексту
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.position.toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }
    
    // Фильтр по этапам
    if (filters.stages && filters.stages.length > 0) {
      if (!filters.stages.includes(candidate.stage)) return false
    }
    
    // Фильтр по тегам
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => candidate.tags.includes(tag))
      if (!hasTag) return false
    }
    
    return true
  })
}