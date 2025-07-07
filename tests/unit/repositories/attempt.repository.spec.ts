import { ObjectId } from 'mongodb'
import { DeleteResult } from 'mongoose'
import { AttemptDTO } from '../../../src/DTOs/attempt/attempt.dto'
import { CreateAttemptDTO } from '../../../src/DTOs/attempt/create.dto'
import Attempt from '../../../src/models/Attempt'
import attemptRepository from '../../../src/repositories/attempt.repository'

jest.mock('../../../src/models/Attempt')

describe('AttemptRepository', () => {
  const mockNewAttempt = {
    userId: new ObjectId(),
    type: 'login',
    success: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as CreateAttemptDTO

  it('should create a new attempt', async () => {
    ;(Attempt.create as jest.Mock).mockResolvedValue(mockNewAttempt)

    const attempt = await attemptRepository.create(mockNewAttempt)

    expect(attempt).toBeDefined()
    expect(attempt.userId).toEqual(mockNewAttempt.userId)
    expect(attempt.type).toEqual(mockNewAttempt.type)
    expect(attempt.success).toEqual(mockNewAttempt.success)
  })

  it('should find an attempt by userId and type', async () => {
    ;(Attempt.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockNewAttempt),
    })
    const attempt = (await attemptRepository.findOne({
      query: { userId: mockNewAttempt.userId, type: mockNewAttempt.type },
      projection: {},
      options: {},
    })) as AttemptDTO

    expect(attempt).toBeDefined()
    expect(attempt.userId).toEqual(mockNewAttempt.userId)
    expect(attempt.type).toEqual(mockNewAttempt.type)
  })

  it('should count attempts by userId', async () => {
    ;(Attempt.countDocuments as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(5),
    })

    const count = await attemptRepository.count({ userId: mockNewAttempt.userId })

    expect(count).toBe(5)
  })

  it('should delete an attempt by userId and type', async () => {
    const mockDeleteResult = { deletedCount: 1 } as unknown as DeleteResult
    ;(Attempt.deleteOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDeleteResult),
    })

    const result = await attemptRepository.delete({
      userId: mockNewAttempt.userId,
      type: mockNewAttempt.type,
    })

    expect(result.deletedCount).toBe(1)
  })
})
