import { ProjectionType, QueryOptions, RootFilterQuery } from 'mongoose'
import { UserDTO } from '../DTOs/user/user.dto'
import { PublicUserDTO } from '../DTOs/user/user.public.dto'

export type ModelQuery<T> = {
  query?: RootFilterQuery<T>
  projection?: ProjectionType<T>
  options?: QueryOptions
}

export type PaginatedResponse<T> =
  | { documents: T[]; page: number; limit: number; total: number; totalPages: number }
  | T[]

export type Gender = 'male' | 'female' | 'other'

export type LoginResponse = {
  token: string
  refreshToken: string
  user: PublicUserDTO
}

export type AuthServiceLoginResponse = {
  token: string
  refreshToken: string
  user: UserDTO
}

export type SignupCredentials = {
  id: string
  email: string
  password: string
}
