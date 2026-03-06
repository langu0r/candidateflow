import { StageType } from '../constants/stages'

/**
 * Мок-база данных, имитирующая структуру реальной БД
 * Все коллекции соответствуют таблицам из предоставленной схемы
 */

// Вспомогательная функция для генерации ID
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

// Текущая дата для новых записей
const now = new Date()

/**
 * Функция для имитации задержки сети
 * @param {number} ms - миллисекунды задержки
 * @returns {Promise<void>}
 */
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * База данных в памяти
 */
export const db = {
  // Таблица users
  users: [
    {
      id: 'user-1',
      email: 'demo@recruiter.com',
      passwordHash: 'demo123', // В реальности хэш, здесь для простоты
      name: 'Demo Recruiter',
      role: 'recruiter',
      createdAt: new Date('2025-01-01T10:00:00'),
      updatedAt: new Date('2025-01-01T10:00:00')
    },
    {
      id: 'user-2',
      email: 'admin@recruiter.com',
      passwordHash: 'admin123',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date('2025-01-01T10:00:00'),
      updatedAt: new Date('2025-01-01T10:00:00')
    },
    {
      id: 'user-3',
      email: 'hiring@company.com',
      passwordHash: 'hiring123',
      name: 'Jane Manager',
      role: 'hiring_manager',
      createdAt: new Date('2025-01-15T09:00:00'),
      updatedAt: new Date('2025-01-15T09:00:00')
    }
  ],

  // Таблица positions
  positions: [
    {
      id: 'pos-1',
      title: 'Software Engineer',
      department: 'Engineering',
      description: 'Full-stack developer with React and Node.js experience',
      hiringManagerId: 'user-3',
      createdAt: new Date('2025-01-10T08:00:00'),
      closedAt: null
    },
    {
      id: 'pos-2',
      title: 'Marketing Intern',
      department: 'Marketing',
      description: 'Intern for digital marketing campaigns',
      hiringManagerId: null,
      createdAt: new Date('2025-01-15T14:30:00'),
      closedAt: null
    },
    {
      id: 'pos-3',
      title: 'UX Designer',
      department: 'Design',
      description: 'Senior UX/UI designer for product team',
      hiringManagerId: 'user-3',
      createdAt: new Date('2025-01-05T11:20:00'),
      closedAt: null
    },
    {
      id: 'pos-4',
      title: 'Product Manager',
      department: 'Product',
      description: 'Experienced PM for B2B SaaS product',
      hiringManagerId: null,
      createdAt: new Date('2025-02-01T09:15:00'),
      closedAt: null
    }
  ],

  // Таблица candidates
  candidates: [
    {
      id: 'cand-1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 123-4567',
      positionId: 'pos-1',
      position: 'Software Engineer', // денормализовано
      stage: StageType.INTERVIEW,
      createdAt: new Date('2025-02-05T14:20:00'),
      updatedAt: new Date('2025-02-08T09:00:00')
    },
    {
      id: 'cand-2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      positionId: 'pos-2',
      position: 'Marketing Intern',
      stage: StageType.SCREENING,
      createdAt: new Date('2025-02-09T11:15:00'),
      updatedAt: new Date('2025-02-09T11:15:00')
    },
    {
      id: 'cand-3',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      phone: '+1 (555) 345-6789',
      positionId: 'pos-3',
      position: 'UX Designer',
      stage: StageType.OFFER,
      createdAt: new Date('2025-02-06T09:00:00'),
      updatedAt: new Date('2025-02-09T16:00:00')
    },
    {
      id: 'cand-4',
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+1 (555) 456-7890',
      positionId: 'pos-1',
      position: 'Software Engineer',
      stage: StageType.APPLIED,
      createdAt: new Date('2025-02-10T10:30:00'),
      updatedAt: new Date('2025-02-10T10:30:00')
    },
    {
      id: 'cand-5',
      name: 'Lisa Wang',
      email: 'lisa.wang@example.com',
      phone: '+1 (555) 567-8901',
      positionId: 'pos-4',
      position: 'Product Manager',
      stage: StageType.SCREENING,
      createdAt: new Date('2025-02-08T13:45:00'),
      updatedAt: new Date('2025-02-08T13:45:00')
    }
  ],

  // Таблица comments
  comments: [
    {
      id: 'comm-1',
      candidateId: 'cand-1',
      userId: 'user-1',
      authorName: 'Demo Recruiter',
      content: 'Strong technical skills, good cultural fit',
      createdAt: new Date('2025-02-08T10:30:00'),
      updatedAt: new Date('2025-02-08T10:30:00')
    },
    {
      id: 'comm-2',
      candidateId: 'cand-3',
      userId: 'user-3',
      authorName: 'Jane Manager',
      content: 'Excellent portfolio, ready to extend offer',
      createdAt: new Date('2025-02-09T16:45:00'),
      updatedAt: new Date('2025-02-09T16:45:00')
    },
    {
      id: 'comm-3',
      candidateId: 'cand-4',
      userId: 'user-1',
      authorName: 'Demo Recruiter',
      content: 'Need to review CV and technical background',
      createdAt: new Date('2025-02-10T11:00:00'),
      updatedAt: new Date('2025-02-10T11:00:00')
    }
  ],

  // Таблица interviews
  interviews: [
    {
      id: 'int-1',
      candidateId: 'cand-1',
      round: 'technical',
      type: 'video',
      scheduledAt: new Date('2025-02-12T15:00:00'),
      status: 'scheduled',
      feedback: null,
      createdAt: new Date('2025-02-08T11:00:00'),
      updatedAt: new Date('2025-02-08T11:00:00')
    },
    {
      id: 'int-2',
      candidateId: 'cand-3',
      round: 'final',
      type: 'onsite',
      scheduledAt: new Date('2025-02-11T14:30:00'),
      status: 'completed',
      feedback: 'Excellent communication skills, strong portfolio',
      createdAt: new Date('2025-02-07T09:30:00'),
      updatedAt: new Date('2025-02-09T10:00:00')
    }
  ],

  // Таблица documents
  documents: [
    {
      id: 'doc-1',
      candidateId: 'cand-1',
      fileUrl: '/mock/cv/sarah_johnson_cv.pdf',
      fileSize: 245760,
      uploadedById: 'user-1',
      originalName: 'sarah_johnson_cv.pdf',
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-02-05T14:25:00')
    },
    {
      id: 'doc-2',
      candidateId: 'cand-2',
      fileUrl: '/mock/cv/michael_chen_resume.pdf',
      fileSize: 184320,
      uploadedById: null,
      originalName: 'michael_chen_resume.pdf',
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-02-09T11:20:00')
    },
    {
      id: 'doc-3',
      candidateId: 'cand-3',
      fileUrl: '/mock/cv/emily_rodriguez_portfolio.pdf',
      fileSize: 512000,
      uploadedById: 'user-3',
      originalName: 'emily_rodriguez_portfolio.pdf',
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-02-06T09:05:00')
    }
  ],

  // Таблица tags
  tags: [
    { id: 'tag-1', name: 'Experienced', color: '#3B82F6' },
    { id: 'tag-2', name: 'Frontend', color: '#8B5CF6' },
    { id: 'tag-3', name: 'Intern', color: '#10B981' },
    { id: 'tag-4', name: 'Marketing', color: '#F59E0B' },
    { id: 'tag-5', name: 'Design', color: '#EC4899' },
    { id: 'tag-6', name: 'Backend', color: '#EF4444' },
    { id: 'tag-7', name: 'Remote', color: '#6366F1' }
  ],

  // Таблица candidate_tags
  candidateTags: [
    { candidateId: 'cand-1', tagId: 'tag-1' },
    { candidateId: 'cand-1', tagId: 'tag-2' },
    { candidateId: 'cand-2', tagId: 'tag-3' },
    { candidateId: 'cand-2', tagId: 'tag-4' },
    { candidateId: 'cand-3', tagId: 'tag-1' },
    { candidateId: 'cand-3', tagId: 'tag-5' },
    { candidateId: 'cand-4', tagId: 'tag-6' }
  ],

  // Таблица history
  history: [
    {
      id: 'hist-1',
      candidateId: 'cand-1',
      actionType: 'stage_changed',
      performedById: 'user-1',
      performedByName: 'Demo Recruiter',
      action: 'Moved to Interview',
      details: 'Candidate passed initial screening',
      createdAt: new Date('2025-02-08T09:00:00')
    },
    {
      id: 'hist-2',
      candidateId: 'cand-1',
      actionType: 'application_received',
      performedById: null,
      performedByName: 'System',
      action: 'Application Received',
      details: 'Applied for Software Engineer position',
      createdAt: new Date('2025-02-05T14:20:00')
    },
    {
      id: 'hist-3',
      candidateId: 'cand-2',
      actionType: 'application_received',
      performedById: null,
      performedByName: 'System',
      action: 'Application Received',
      details: 'Applied for Marketing Intern position',
      createdAt: new Date('2025-02-09T11:15:00')
    },
    {
      id: 'hist-4',
      candidateId: 'cand-3',
      actionType: 'stage_changed',
      performedById: 'user-3',
      performedByName: 'Jane Manager',
      action: 'Moved to Offer',
      details: 'Completed all interview rounds successfully',
      createdAt: new Date('2025-02-09T16:00:00')
    },
    {
      id: 'hist-5',
      candidateId: 'cand-3',
      actionType: 'interview_completed',
      performedById: 'user-3',
      performedByName: 'Jane Manager',
      action: 'Interview Completed',
      details: 'Final round interview with design team',
      createdAt: new Date('2025-02-08T15:30:00')
    },
    {
      id: 'hist-6',
      candidateId: 'cand-3',
      actionType: 'application_received',
      performedById: null,
      performedByName: 'System',
      action: 'Application Received',
      details: 'Applied for UX Designer position',
      createdAt: new Date('2025-02-06T09:00:00')
    }
  ]
}

/**
 * Сохраняем исходное состояние для сброса
 */
const initialDb = JSON.parse(JSON.stringify(db))

/**
 * Сброс БД к исходному состоянию
 */
export const resetDb = () => {
  Object.keys(db).forEach(key => {
    db[key] = JSON.parse(JSON.stringify(initialDb[key]))
  })
}

/**
 * Получение коллекции
 */
export const getCollection = (name) => {
  if (!db[name]) {
    throw new Error(`Collection ${name} does not exist`)
  }
  return db[name]
}

/**
 * Поиск по ID
 */
export const findById = (collection, id) => {
  return db[collection].find(item => item.id === id) || null
}

/**
 * Поиск с фильтрацией
 */
export const find = (collection, filter = {}) => {
  return db[collection].filter(item => {
    return Object.entries(filter).every(([key, value]) => item[key] === value)
  })
}

/**
 * Вставка новой записи
 */
export const insert = (collection, item) => {
  const newItem = {
    id: generateId(),
    ...item,
    createdAt: item.createdAt || new Date(),
    updatedAt: item.updatedAt || new Date()
  }
  
  db[collection].push(newItem)
  return newItem
}

/**
 * Обновление записи
 */
export const update = (collection, id, changes) => {
  const index = db[collection].findIndex(item => item.id === id)
  if (index === -1) return null
  
  const updatedItem = {
    ...db[collection][index],
    ...changes,
    updatedAt: new Date()
  }
  
  db[collection][index] = updatedItem
  return updatedItem
}

/**
 * Удаление записи
 */
export const remove = (collection, id) => {
  const index = db[collection].findIndex(item => item.id === id)
  if (index === -1) return false
  
  db[collection].splice(index, 1)
  return true
}

/**
 * Получение тегов кандидата
 */
export const getCandidateTags = (candidateId) => {
  const tagIds = db.candidateTags
    .filter(ct => ct.candidateId === candidateId)
    .map(ct => ct.tagId)
  
  return db.tags.filter(tag => tagIds.includes(tag.id))
}

/**
 * Добавление тега кандидату
 */
export const addTagToCandidate = (candidateId, tagId) => {
  // Проверяем, существует ли уже такая связь
  const exists = db.candidateTags.some(
    ct => ct.candidateId === candidateId && ct.tagId === tagId
  )
  
  if (!exists) {
    db.candidateTags.push({ candidateId, tagId })
  }
  
  return getCandidateTags(candidateId)
}

/**
 * Удаление тега у кандидата
 */
export const removeTagFromCandidate = (candidateId, tagId) => {
  const index = db.candidateTags.findIndex(
    ct => ct.candidateId === candidateId && ct.tagId === tagId
  )
  
  if (index !== -1) {
    db.candidateTags.splice(index, 1)
  }
  
  return getCandidateTags(candidateId)
}

/**
 * Получение комментариев кандидата
 */
export const getCandidateComments = (candidateId) => {
  return db.comments
    .filter(comment => comment.candidateId === candidateId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Получение истории кандидата
 */
export const getCandidateHistory = (candidateId) => {
  return db.history
    .filter(entry => entry.candidateId === candidateId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Получение полных данных кандидата (с комментариями, тегами, историей)
 */
export const getCandidateWithDetails = (candidateId) => {
  const candidate = findById('candidates', candidateId)
  if (!candidate) return null
  
  const tags = getCandidateTags(candidateId)
  const comments = getCandidateComments(candidateId)
  const history = getCandidateHistory(candidateId)
  const document = db.documents.find(doc => doc.candidateId === candidateId)
  
  return {
    ...candidate,
    tags: tags.map(t => t.name),
    comments,
    history,
    cv: document ? {
      id: document.id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      fileSize: document.fileSize,
      fileUrl: document.fileUrl,
      uploadedById: document.uploadedById,
      uploadedAt: document.uploadedAt
    } : null
  }
}

/**
 * Добавление комментария
 */
export const addComment = (candidateId, userId, content) => {
  const user = userId ? findById('users', userId) : null
  
  const newComment = insert('comments', {
    candidateId,
    userId: userId || null,
    authorName: user ? user.name : 'Anonymous',
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  // Добавляем запись в историю
  insert('history', {
    candidateId,
    actionType: 'comment_added',
    performedById: userId || null,
    performedByName: user ? user.name : 'System',
    action: 'Comment Added',
    details: content,
    createdAt: new Date()
  })
  
  return newComment
}

/**
 * Добавление записи в историю
 */
export const addHistoryEntry = (candidateId, actionType, performedById, action, details) => {
  const user = performedById ? findById('users', performedById) : null
  
  return insert('history', {
    candidateId,
    actionType,
    performedById: performedById || null,
    performedByName: user ? user.name : 'System',
    action,
    details,
    createdAt: new Date()
  })
}