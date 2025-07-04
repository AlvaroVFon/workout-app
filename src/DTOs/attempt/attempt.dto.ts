import { ObjectId } from 'mongodb'

export interface AttemptDTO {
  id: string
  userId: ObjectId
  email?: string
  attemptedAt: Date
  success: boolean
  type: 'login' | 'recovery' | string
}
