// api/index.js
export * from './client'
export * from './normalizers'
export * from './config'

export * as candidatesApi from './candidates'
export * as commentsApi from './comments'
export * as historyApi from './history'
export * as positionsApi from './positions'
export * as tagsApi from './tags'
export * as usersApi from './users'

// Единый объект API для удобства
export const api = {
  candidates: candidatesApi,
  comments: commentsApi,
  history: historyApi,
  positions: positionsApi,
  tags: tagsApi,
  users: usersApi
}