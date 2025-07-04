import { Date, ObjectId } from 'mongoose'

export interface SessionDTO {
  _id: ObjectId
  userId: ObjectId
  createdAt: Date
  updatedAt?: Date
  expiresAt: Date
  refreshTokenHash: string
  isActive: boolean
  replacedBy?: ObjectId
}
