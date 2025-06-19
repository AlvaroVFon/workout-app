import { ObjectId, Timestamp } from 'mongodb'
import Role from '../DTOs/role/role.dto'

export interface AuthenticatedUser {
  _id: ObjectId
  name: string
  email: string
  password: string
  role: Role
  idDocument: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
