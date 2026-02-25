import { db, delay } from './mockDb'

export const fetchHistory = async (candidateId) => {
  await delay(200)
  return db.history
    .filter(h => h.candidateId === candidateId)
    .sort((a, b) => b.createdAt - a.createdAt)
}