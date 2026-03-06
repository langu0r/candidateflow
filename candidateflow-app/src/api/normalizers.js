// api/normalizers.js
import { STAGE_MAPPING } from '../constants/stages'

/**
 * Нормализация кандидата из API в формат фронтенда
 */
export const normalizeCandidate = (candidate) => {
  if (!candidate) return null

  return {
    id: candidate.candidate_id,
    candidate_id: candidate.candidate_id,
    name: [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') || 'Unknown',
    first_name: candidate.first_name || '',
    last_name: candidate.last_name || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    position_id: candidate.position_id,
    position: candidate.position_title || `Position #${candidate.position_id}`,
    stage: STAGE_MAPPING[candidate.stage] || candidate.stage?.toLowerCase() || 'applied',
    createdAt: candidate.created_at || new Date().toISOString(),
    updatedAt: candidate.updated_at || new Date().toISOString(),
    tags: Array.isArray(candidate.tags) ? candidate.tags : [],
    comments: Array.isArray(candidate.comments) ? candidate.comments.map(normalizeComment) : [],
    history: Array.isArray(candidate.history) ? candidate.history.map(normalizeHistory) : [],
    cv: candidate.cv ? normalizeCV(candidate.cv) : null
  }
}

/**
 * Нормализация комментария
 */
export const normalizeComment = (comment) => ({
  id: comment.comment_id,
  comment_id: comment.comment_id,
  candidate_id: comment.candidate_id,
  user_id: comment.user_id,
  content: comment.content || '',
  authorName: comment.author_name || 'Unknown',
  createdAt: comment.created_at,
  updatedAt: comment.updated_at
})

/**
 * Нормализация истории
 */
export const normalizeHistory = (entry) => ({
  id: entry.history_id,
  history_id: entry.history_id,
  candidate_id: entry.candidate_id,
  action_type: entry.action_type,
  action: entry.action || entry.action_type,
  details: entry.details || '',
  performed_by: entry.performed_by,
  performedByName: entry.performed_by_name || 'System',
  createdAt: entry.created_at
})

/**
 * Нормализация CV
 */
export const normalizeCV = (cv) => ({
  originalName: cv.original_name || cv.originalName,
  fileSize: cv.file_size || cv.fileSize,
  mimeType: cv.mime_type || cv.mimeType,
  fileUrl: cv.file_url || cv.fileUrl,
  uploadedAt: cv.uploaded_at || cv.uploadedAt
})

/**
 * Нормализация позиции
 */
export const normalizePosition = (position) => ({
  id: position.position_id,
  position_id: position.position_id,
  title: position.title || '',
  department: position.department || '',
  description: position.description || '',
  hiring_manager_id: position.hiring_manager_id
})

/**
 * Нормализация пользователя
 */
export const normalizeUser = (user) => ({
  id: user.user_id,
  user_id: user.user_id,
  name: user.name || '',
  email: user.email || '',
  role: user.role || 'hiring_manager'
})

/**
 * Нормализация тега
 */
export const normalizeTag = (tag) => ({
  id: tag.tag_id,
  tag_id: tag.tag_id,
  name: tag.name || '',
  color: tag.color || '#3B82F6'
})