// Константы для этапов
export const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' }
]

// Типы этапов
export const StageType = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

// Схема кандидата
export const CandidateSchema = {
  id: '',
  name: '',
  email: '',
  phone: '',
  position: '',
  stage: StageType.APPLIED,
  cvFileName: '',
  cvFileData: '',
  appliedAt: new Date().toISOString(),
  tags: [],
  comments: [],
  history: []
}

// Схема комментария
export const CommentSchema = {
  id: '',
  author: '',
  text: '',
  timestamp: new Date().toISOString()
}

// Схема истории
export const HistoryEntrySchema = {
  id: '',
  action: '',
  details: '',
  timestamp: new Date().toISOString()
}