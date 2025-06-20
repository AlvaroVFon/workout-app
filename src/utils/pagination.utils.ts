import { PaginatedResponse } from '../types/index.types'

export function paginateResponse<T>(
  documents: T[],
  page: number,
  limit: number,
  total: number,
  paginate: boolean,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)
  return paginate
    ? {
        documents,
        page,
        limit,
        total,
        totalPages,
      }
    : documents
}
