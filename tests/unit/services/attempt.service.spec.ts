import { DeleteResult, ObjectId } from 'mongodb'
import { AttemptDTO } from '../../../src/DTOs/attempt/attempt.dto'
import { CreateAttemptDTO } from '../../../src/DTOs/attempt/create.dto'
import attemptRepository from '../../../src/repositories/attempt.repository'
import attemptService from '../../../src/services/attempt.service'

jest.mock('../../../src/repositories/attempt.repository')

describe('AttemptService', () => {
  const mockNewAttempt = {
    userId: new ObjectId(),
    type: 'login',
    success: true,
    createdAt: new Date(),
  } as CreateAttemptDTO

  it('should create a new attempt', async () => {
    ;(attemptRepository.create as jest.Mock).mockResolvedValue(mockNewAttempt)

    const attempt = await attemptService.create(mockNewAttempt)

    expect(attempt).toBeDefined()
    expect(attempt.userId).toEqual(mockNewAttempt.userId)
    expect(attempt.type).toEqual(mockNewAttempt.type)
    expect(attempt.success).toEqual(mockNewAttempt.success)
  })

  it('should find an attempt by userId and type', async () => {
    ;(attemptRepository.findOne as jest.Mock).mockResolvedValue(mockNewAttempt)

    const attempt = (await attemptService.findByUserAndType(
      mockNewAttempt.userId.toString(),
      mockNewAttempt.type,
    )) as AttemptDTO

    expect(attempt).toBeDefined()
    expect(attempt.userId).toEqual(mockNewAttempt.userId)
    expect(attempt.type).toEqual(mockNewAttempt.type)
  })

  it('should count attempts by userId', async () => {
    ;(attemptRepository.count as jest.Mock).mockResolvedValue(5)

    const count = await attemptService.countByUserAndType(mockNewAttempt.userId.toString(), mockNewAttempt.type)

    expect(count).toBe(5)
  })

  it('should count attempts by user email and type', async () => {
    ;(attemptRepository.count as jest.Mock).mockResolvedValue(3)

    const count = await attemptService.countByUserEmailAndType(mockNewAttempt.userId.toString(), mockNewAttempt.type)

    expect(count).toBe(3)
  })

  it('should delete an attempt by userId and type', async () => {
    const mockDeleteResult = { deletedCount: 1 } as unknown as DeleteResult
    ;(attemptRepository.delete as jest.Mock).mockResolvedValue(mockDeleteResult)

    const result = await attemptService.deleteByUserAndType(
      mockNewAttempt.userId.toString(),
      mockNewAttempt.type,
      mockNewAttempt.success,
    )

    expect(result.deletedCount).toBe(1)
  })

  it('should check if max login attempts are reached', async () => {
    ;(attemptRepository.count as jest.Mock).mockResolvedValue(3)
    const maxAttempts = 5

    const isMaxReached = await attemptService.isMaxLoginAttemptsReached(mockNewAttempt.userId.toString(), maxAttempts)

    expect(isMaxReached).toBe(false)
  })
})
