/**
 * Константы этапов кандидатов
 */

export const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' }
]

export const StageType = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
}

export const StageLabels = {
  [StageType.APPLIED]: 'Applied',
  [StageType.SCREENING]: 'Screening',
  [StageType.INTERVIEW]: 'Interview',
  [StageType.OFFER]: 'Offer',
  [StageType.HIRED]: 'Hired',
  [StageType.REJECTED]: 'Rejected'
}

export const StageColors = {
  [StageType.APPLIED]: '#9CA3AF',
  [StageType.SCREENING]: '#3B82F6',
  [StageType.INTERVIEW]: '#8B5CF6',
  [StageType.OFFER]: '#F59E0B',
  [StageType.HIRED]: '#10B981',
  [StageType.REJECTED]: '#EF4444'
}

export const StageBgColors = {
  [StageType.APPLIED]: 'bg-gray-50 border-gray-200',
  [StageType.SCREENING]: 'bg-blue-50 border-blue-200',
  [StageType.INTERVIEW]: 'bg-purple-50 border-purple-200',
  [StageType.OFFER]: 'bg-yellow-50 border-yellow-200',
  [StageType.HIRED]: 'bg-green-50 border-green-200',
  [StageType.REJECTED]: 'bg-red-50 border-red-200'
}