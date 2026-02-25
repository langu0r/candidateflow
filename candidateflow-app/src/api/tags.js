import { db, insert, delay } from './mockDb'

export const fetchAllTags = async () => {
  await delay(200)
  return db.tags
}

export const createTag = async (name, color = null) => {
  await delay(200)
  return insert('tags', { name, color })
}