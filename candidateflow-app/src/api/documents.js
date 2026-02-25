import { db, insert, remove, delay } from './mockDb'

export const fetchDocuments = async (candidateId) => {
  await delay(200)
  return db.documents.filter(d => d.candidateId === candidateId)
}

export const uploadDocument = async (candidateId, file, uploadedById) => {
  await delay(500)
  
  return insert('documents', {
    candidateId,
    fileUrl: URL.createObjectURL(file), // Временный URL для мока
    fileSize: file.size,
    uploadedById: uploadedById || null,
    originalName: file.name,
    mimeType: file.type,
    uploadedAt: new Date()
  })
}

export const deleteDocument = async (id) => {
  await delay(200)
  return remove('documents', id)
}