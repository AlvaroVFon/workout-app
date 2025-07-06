import attemptRepository from '../../../src/repositories/attempt.repository'
import { CreateAttemptDTO } from '../../../src/DTOs/attempt/create.dto'
import { ObjectId } from 'mongodb'

describe('AttemptRepository', () => {
  const mockNewAttempt = {
    userId: new ObjectId(),
    type: 'login',
    success: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as CreateAttemptDTO

  it('should create a new attempt', async () => {
    const attempt = await attemptRepository.create(mockNewAttempt)

    expect(attempt).toBeDefined()
    expect(attempt.userId).toEqual(mockNewAttempt.userId)
    expect(attempt.type).toEqual(mockNewAttempt.type)
    expect(attempt.success).toEqual(mockNewAttempt.success)
  })
})
