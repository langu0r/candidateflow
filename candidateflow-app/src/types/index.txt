/**
 * @typedef {Object} User
 * @property {string} id - Уникальный идентификатор пользователя (UUID)
 * @property {string} email - Email для авторизации
 * @property {string} passwordHash - Хэш пароля (только для мока)
 * @property {string} name - Полное имя
 * @property {'recruiter'|'admin'|'hiring_manager'} role - Роль пользователя
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 */

/**
 * @typedef {Object} Position
 * @property {string} id - Идентификатор вакансии
 * @property {string} title - Название позиции
 * @property {string} department - Отдел
 * @property {string|null} description - Описание позиции
 * @property {string|null} hiringManagerId - ID руководителя (FK → users)
 * @property {Date} createdAt - Дата создания
 * @property {Date|null} closedAt - Дата закрытия
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id - Идентификатор кандидата
 * @property {string} name - ФИО
 * @property {string} email - Email кандидата
 * @property {string|null} phone - Телефон
 * @property {string} positionId - ID позиции (FK → positions)
 * @property {string} position - Название позиции (денормализовано для удобства)
 * @property {string} stage - Текущий этап (applied, screening, interview, offer, hired, rejected)
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 * @property {string[]} tags - Массив ID тегов (будет денормализовано)
 * @property {Comment[]} comments - Комментарии (для UI)
 * @property {HistoryEntry[]} history - История (для UI)
 * @property {Object|null} cv - Данные CV
 * @property {string} cv.originalName - Оригинальное имя файла
 * @property {string} cv.mimeType - MIME-тип
 * @property {number} cv.fileSize - Размер в байтах
 * @property {string} cv.fileUrl - URL или data URL
 * @property {string} cv.uploadedById - ID загрузившего пользователя
 * @property {Date} cv.uploadedAt - Дата загрузки
 */

/**
 * @typedef {Object} Comment
 * @property {string} id - Идентификатор комментария
 * @property {string} candidateId - ID кандидата
 * @property {string|null} userId - ID автора
 * @property {string} authorName - Имя автора (денормализовано)
 * @property {string} content - Текст комментария
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 */

/**
 * @typedef {Object} Interview
 * @property {string} id - Идентификатор интервью
 * @property {string} candidateId - ID кандидата
 * @property {'screening'|'technical'|'cultural'|'final'} round - Раунд
 * @property {'phone'|'video'|'onsite'} type - Тип интервью
 * @property {Date} scheduledAt - Дата и время
 * @property {'scheduled'|'completed'|'cancelled'|'no_show'} status - Статус
 * @property {string|null} feedback - Отзыв
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 */

/**
 * @typedef {Object} Document
 * @property {string} id - Идентификатор документа
 * @property {string} candidateId - ID кандидата
 * @property {string} fileUrl - Ссылка на файл
 * @property {number} fileSize - Размер в байтах
 * @property {string|null} uploadedById - ID загрузившего пользователя
 * @property {string} originalName - Оригинальное имя файла
 * @property {string} mimeType - MIME-тип
 * @property {Date} uploadedAt - Дата загрузки
 */

/**
 * @typedef {Object} Tag
 * @property {string} id - Идентификатор тега
 * @property {string} name - Название
 * @property {string|null} color - Цвет (hex)
 */

/**
 * @typedef {Object} CandidateTag
 * @property {string} candidateId - ID кандидата
 * @property {string} tagId - ID тега
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} id - Идентификатор записи истории
 * @property {string} candidateId - ID кандидата
 * @property {string} actionType - Тип действия
 * @property {string|null} performedById - ID пользователя
 * @property {string} performedByName - Имя пользователя (денормализовано)
 * @property {string} action - Действие для отображения
 * @property {string} details - Детали
 * @property {Date} createdAt - Дата и время
 */