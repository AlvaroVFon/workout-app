import { BlockInfo } from './user.dto'

export interface UpdateUserDTO {
  name?: string
  lastName?: string
  email?: string
  role?: string
  password?: string
  country?: string
  address?: string
  blocks?: BlockInfo[]
  idDocument?: string
  updatedAt?: number
}
