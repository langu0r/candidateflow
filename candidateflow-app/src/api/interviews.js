import { db, insert, update, remove, delay } from './mockDb'

export const fetchInterviews = async (candidateId) => {
  await delay(200)
  return db.interviews.filter(i => i.candidateId === candidateId)
}

export const createInterview = async (data) => {
  await delay(300)
  return insert('interviews', data)
}

export const updateInterview = async (id, updates) => {
  await delay(200)
  return update('interviews', id, updates)
}