import { AttemptDTO } from '../DTOs/attempt/attempt.dto'
import { CreateAttemptDTO } from '../DTOs/attempt/create.dto'
import attemptRepository from '../repositories/attempt.repository'
import { AttemptsEnum } from '../utils/enums/attempts.enum'

class AttemptService {
  async create(attempt: CreateAttemptDTO): Promise<AttemptDTO> {
    return attemptRepository.create(attempt)
  }

  async findByUserAndType(userId: string, type: string): Promise<AttemptDTO | null> {
    return attemptRepository.findByUserIdAndType(userId, type)
  }

  async countByUserAndType(userId: string, type: string, success: boolean = false): Promise<number> {
    return attemptRepository.countByUserIdAndType(userId, type, success)
  }

  async countByUserEmailAndType(email: string, type: string, success: boolean = false): Promise<number> {
    return attemptRepository.countByUserEmailAndType(email, type, success)
  }

  async deleteByUserAndType(userId: string, type: string, success: boolean = false): Promise<void> {
    await attemptRepository.deleteByUserIdAndType(userId, type, success)
  }

  async isMaxLoginAttemptsReached(userId: string, maxAttempts: number): Promise<boolean> {
    const attempts = await this.countByUserAndType(userId, AttemptsEnum.LOGIN, false)
    return attempts >= maxAttempts
  }
}

export default new AttemptService()
