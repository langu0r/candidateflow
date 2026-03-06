// constants/stages.js
export const STAGE_TYPES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

export const STAGES = [
  { id: STAGE_TYPES.APPLIED, label: 'Applied' },
  { id: STAGE_TYPES.SCREENING, label: 'Screening' },
  { id: STAGE_TYPES.INTERVIEW, label: 'Interview' },
  { id: STAGE_TYPES.OFFER, label: 'Offer' },
  { id: STAGE_TYPES.HIRED, label: 'Hired' },
  { id: STAGE_TYPES.REJECTED, label: 'Rejected' }
]

// Маппинг для API (верхний регистр)
export const STAGE_MAPPING = {
  'APPLIED': STAGE_TYPES.APPLIED,
  'SCREENING': STAGE_TYPES.SCREENING,
  'INTERVIEW': STAGE_TYPES.INTERVIEW,
  'OFFER': STAGE_TYPES.OFFER,
  'HIRED': STAGE_TYPES.HIRED,
  'REJECTED': STAGE_TYPES.REJECTED
}

// Цвета для этапов
export const STAGE_COLORS = {
  [STAGE_TYPES.APPLIED]: '#9CA3AF',
  [STAGE_TYPES.SCREENING]: '#3B82F6',
  [STAGE_TYPES.INTERVIEW]: '#8B5CF6',
  [STAGE_TYPES.OFFER]: '#F59E0B',
  [STAGE_TYPES.HIRED]: '#10B981',
  [STAGE_TYPES.REJECTED]: '#EF4444'
}

// CSS классы для фона колонок
export const STAGE_BG_CLASSES = {
  [STAGE_TYPES.APPLIED]: 'bg-gray-50 border-gray-200',
  [STAGE_TYPES.SCREENING]: 'bg-blue-50 border-blue-200',
  [STAGE_TYPES.INTERVIEW]: 'bg-purple-50 border-purple-200',
  [STAGE_TYPES.OFFER]: 'bg-yellow-50 border-yellow-200',
  [STAGE_TYPES.HIRED]: 'bg-green-50 border-green-200',
  [STAGE_TYPES.REJECTED]: 'bg-red-50 border-red-200'
}

// Человеческие названия этапов (если нужны отдельно)
export const STAGE_LABELS = {
  [STAGE_TYPES.APPLIED]: 'Applied',
  [STAGE_TYPES.SCREENING]: 'Screening',
  [STAGE_TYPES.INTERVIEW]: 'Interview',
  [STAGE_TYPES.OFFER]: 'Offer',
  [STAGE_TYPES.HIRED]: 'Hired',
  [STAGE_TYPES.REJECTED]: 'Rejected'
}