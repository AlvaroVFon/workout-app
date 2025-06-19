import { ObjectId, Timestamp } from 'mongodb'

export interface AuthenticatedUser {
  _id: ObjectId
  name: string
  email: string
  password: string
  role: string
  idDocument: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
