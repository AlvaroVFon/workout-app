import { DeleteResult } from 'mongoose'
import { CreateAttemptDTO } from '../DTOs/attempt/create.dto'
import { AttemptDTO } from '../DTOs/attempt/attempt.dto'
import Attempt from '../models/Attempt'

//TODO: simplificar repository, remove unnecessary methods and use generic repository pattern
class RecoveryAttemptRepository {
  create(recoveryAttempt: CreateAttemptDTO): Promise<AttemptDTO> {
    return Attempt.create(recoveryAttempt)
  }

  findByUserId(userId: string): Promise<AttemptDTO | null> {
    return Attempt.findOne({ userId }).exec()
  }

  findByUserIdAndType(userId: string, type: string): Promise<AttemptDTO | null> {
    return Attempt.findOne({ userId, type }).exec()
  }

  countByUserIdAndType(userId: string, type: string, success: boolean = false): Promise<number> {
    return Attempt.countDocuments({ userId, type, success }).exec()
  }

  countByUserEmailAndType(email: string, type: string, success: boolean = false): Promise<number> {
    return Attempt.countDocuments({ email, type, success }).exec()
  }

  deleteByUserIdAndType(userId: string, type: string, success: boolean = false): Promise<DeleteResult> {
    return Attempt.deleteMany({ userId, type, success }).exec()
  }
}

export default new RecoveryAttemptRepository()
