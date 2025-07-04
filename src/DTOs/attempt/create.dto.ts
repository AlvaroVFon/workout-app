import { ObjectId } from 'mongodb'

export interface CreateAttemptDTO {
  userId: ObjectId
  email?: string
  attemptedAt?: Date
  success: boolean
  type: 'login' | 'recovery' | string
}
