import { ObjectId } from 'mongodb'
import { AttemptsEnum } from '../../utils/enums/attempts.enum'

export interface CreateAttemptDTO {
  userId: ObjectId
  email?: string
  attemptedAt?: Date
  success: boolean
  type: AttemptsEnum
}
