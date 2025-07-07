import { AttemptDTO } from '../DTOs/attempt/attempt.dto'
import { CreateAttemptDTO } from '../DTOs/attempt/create.dto'
import attemptRepository from '../repositories/attempt.repository'
import { AttemptsEnum } from '../utils/enums/attempts.enum'

class AttemptService {
  async create(attempt: CreateAttemptDTO): Promise<AttemptDTO> {
    return attemptRepository.create(attempt)
  }

  async findByUserAndType(userId: string, type: string): Promise<AttemptDTO | null> {
    return attemptRepository.findOne({ query: { userId, type } })
  }

  findLastByUserAndType(userId: string, type: AttemptsEnum): Promise<AttemptDTO | null> {
    return attemptRepository.findOne({ query: { userId, type }, options: { sort: { attemptedAt: -1 } } })
  }

  async countByUserAndType(userId: string, type: string, success: boolean = false): Promise<number> {
    return attemptRepository.count({ userId, type, success })
  }

  async countByUserEmailAndType(email: string, type: string, success: boolean = false): Promise<number> {
    return attemptRepository.count({ email, type, success })
  }

  async deleteByUserAndType(userId: string, type: string, success: boolean = false): Promise<{ deletedCount: number }> {
    return attemptRepository.delete({ userId, type, success })
  }

  async isMaxLoginAttemptsReached(userId: string, maxAttempts: number, type: AttemptsEnum): Promise<boolean> {
    const attempts = await this.countByUserAndType(userId, type, false)
    return attempts >= maxAttempts
  }
}

export default new AttemptService()
