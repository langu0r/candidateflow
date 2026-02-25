import { db, findById, delay } from './mockDb'

export const fetchPositions = async () => {
  await delay(300)
  return db.positions.filter(p => p.closedAt === null)
}

export const fetchPositionById = async (id) => {
  await delay(200)
  return findById('positions', id)
}