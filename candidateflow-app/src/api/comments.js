import { db, findById, insert, update, remove, delay } from './mockDb'

export const fetchComments = async (candidateId) => {
  await delay(200)
  return db.comments
    .filter(c => c.candidateId === candidateId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export const createComment = async (candidateId, userId, content) => {
  await delay(200)
  
  const user = userId ? findById('users', userId) : null
  
  return insert('comments', {
    candidateId,
    userId: userId || null,
    authorName: user ? user.name : 'Anonymous',
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

export const updateComment = async (id, content) => {
  await delay(200)
  return update('comments', id, { content })
}

export const deleteComment = async (id) => {
  await delay(200)
  return remove('comments', id)
}