import trainingSessionRepository from '../../../src/repositories/trainingSession.repository'
import TrainingSession from '../../../src/models/TrainingSession'
import { TrainingSessionDTO } from '../../../src/DTOs/trainingSession/trainingSession.dto'
import { TrainingTypeEnum } from '../../../src/utils/enums/trainingTypes.enum'
import { ObjectId } from 'mongodb'

jest.mock('../../../src/models/TrainingSession')

describe('TrainingSessionRepository', () => {
  const mockSession: TrainingSessionDTO = {
    athlete: new ObjectId(),
    date: new Date(),
    type: TrainingTypeEnum.Strength,
    exercises: [],
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a session', async () => {
    ;(TrainingSession.create as jest.Mock).mockResolvedValue(mockSession)
    const result = await trainingSessionRepository.create(mockSession)
    expect(TrainingSession.create).toHaveBeenCalledWith(mockSession)
    expect(result).toEqual(mockSession)
  })

  it('should find a session by ID', async () => {
    ;(TrainingSession.findOne as jest.Mock).mockResolvedValue(mockSession)
    const result = await trainingSessionRepository.findById('sessionId')
    expect(TrainingSession.findOne).toHaveBeenCalledWith({ _id: 'sessionId' }, undefined)
    expect(result).toEqual(mockSession)
  })

  it('should update a session', async () => {
    ;(TrainingSession.findOneAndUpdate as jest.Mock).mockResolvedValue({ ...mockSession, notes: 'Updated' })
    const result = await trainingSessionRepository.update('sessionId', { notes: 'Updated' })
    expect(TrainingSession.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'sessionId' },
      { notes: 'Updated' },
      { new: true },
    )
    expect(result).toEqual({ ...mockSession, notes: 'Updated' })
  })

  it('should delete a session', async () => {
    ;(TrainingSession.findOneAndDelete as jest.Mock).mockResolvedValue(true)
    const result = await trainingSessionRepository.delete('sessionId')
    expect(TrainingSession.findOneAndDelete).toHaveBeenCalledWith({ _id: 'sessionId' })
    expect(result).toBe(true)
  })
})
