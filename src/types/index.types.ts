import { ProjectionType, QueryOptions, RootFilterQuery } from 'mongoose'

export type ModelQuery<T> = {
  query?: RootFilterQuery<T>
  projection?: ProjectionType<T>
  options?: QueryOptions
}

export type PaginatedResponse<T> =
  | { documents: T[]; page: number; limit: number; total: number; totalPages: number }
  | T[]
