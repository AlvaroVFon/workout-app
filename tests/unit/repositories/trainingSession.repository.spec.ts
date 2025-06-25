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
    type: TrainingTypeEnum.STRENGTH,
    exercises: [],
  }

  const mockUpdatedSession: TrainingSessionDTO = {
    ...mockSession,
    notes: 'Updated session',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a session successfully', async () => {
      ;(TrainingSession.create as jest.Mock).mockResolvedValue(mockSession)

      const result = await trainingSessionRepository.create(mockSession)

      expect(TrainingSession.create).toHaveBeenCalledWith(mockSession)
      expect(result).toEqual(mockSession)
    })

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed')
      ;(TrainingSession.create as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.create(mockSession)).rejects.toThrow('Creation failed')
      expect(TrainingSession.create).toHaveBeenCalledWith(mockSession)
    })
  })

  describe('findById', () => {
    it('should find a session by ID successfully', async () => {
      ;(TrainingSession.findOne as jest.Mock).mockResolvedValue(mockSession)

      const result = await trainingSessionRepository.findById('sessionId')

      expect(TrainingSession.findOne).toHaveBeenCalledWith({ _id: 'sessionId' }, undefined)
      expect(result).toEqual(mockSession)
    })

    it('should find a session by ID with projection', async () => {
      const projection = { athlete: 1, date: 1 }
      ;(TrainingSession.findOne as jest.Mock).mockResolvedValue({
        athlete: mockSession.athlete,
        date: mockSession.date,
      })

      const result = await trainingSessionRepository.findById('sessionId', projection)

      expect(TrainingSession.findOne).toHaveBeenCalledWith({ _id: 'sessionId' }, projection)
      expect(result).toEqual({ athlete: mockSession.athlete, date: mockSession.date })
    })

    it('should return null when session not found', async () => {
      ;(TrainingSession.findOne as jest.Mock).mockResolvedValue(null)

      const result = await trainingSessionRepository.findById('nonexistentId')

      expect(TrainingSession.findOne).toHaveBeenCalledWith({ _id: 'nonexistentId' }, undefined)
      expect(result).toBeNull()
    })

    it('should handle findById errors', async () => {
      const error = new Error('Database error')
      ;(TrainingSession.findOne as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.findById('sessionId')).rejects.toThrow('Database error')
    })
  })

  describe('findOne', () => {
    it('should find one session with default parameters', async () => {
      ;(TrainingSession.findOne as jest.Mock).mockResolvedValue(mockSession)

      const result = await trainingSessionRepository.findOne({})

      expect(TrainingSession.findOne).toHaveBeenCalledWith({}, {}, {})
      expect(result).toEqual(mockSession)
    })

    it('should find one session with custom query', async () => {
      const query = { athlete: mockSession.athlete }
      const projection = { type: 1, date: 1 }
      const options = { sort: { date: -1 } }

      ;(TrainingSession.findOne as jest.Mock).mockResolvedValue(mockSession)

      const result = await trainingSessionRepository.findOne({ query, projection, options })

      expect(TrainingSession.findOne).toHaveBeenCalledWith(query, projection, options)
      expect(result).toEqual(mockSession)
    })

    it('should return null when no session matches query', async () => {
      ;(TrainingSession.findOne as jest.Mock).mockResolvedValue(null)

      const result = await trainingSessionRepository.findOne({ query: { athlete: new ObjectId() } })

      expect(result).toBeNull()
    })

    it('should handle findOne errors', async () => {
      const error = new Error('Find error')
      ;(TrainingSession.findOne as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.findOne({})).rejects.toThrow('Find error')
    })
  })

  describe('findAll', () => {
    it('should find all sessions with default parameters', async () => {
      const mockSessions = [mockSession, mockUpdatedSession]
      ;(TrainingSession.find as jest.Mock).mockResolvedValue(mockSessions)

      const result = await trainingSessionRepository.findAll({})

      expect(TrainingSession.find).toHaveBeenCalledWith({}, {}, {})
      expect(result).toEqual(mockSessions)
    })

    it('should find all sessions with custom query and options', async () => {
      const query = { type: TrainingTypeEnum.STRENGTH }
      const projection = { athlete: 1, date: 1, type: 1 }
      const options = { sort: { date: -1 }, limit: 10 }
      const mockSessions = [mockSession]

      ;(TrainingSession.find as jest.Mock).mockResolvedValue(mockSessions)

      const result = await trainingSessionRepository.findAll({ query, projection, options })

      expect(TrainingSession.find).toHaveBeenCalledWith(query, projection, options)
      expect(result).toEqual(mockSessions)
    })

    it('should return empty array when no sessions found', async () => {
      ;(TrainingSession.find as jest.Mock).mockResolvedValue([])

      const result = await trainingSessionRepository.findAll({ query: { athlete: new ObjectId() } })

      expect(result).toEqual([])
    })

    it('should handle findAll errors', async () => {
      const error = new Error('Find all error')
      ;(TrainingSession.find as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.findAll({})).rejects.toThrow('Find all error')
    })
  })

  describe('update', () => {
    it('should update a session successfully', async () => {
      ;(TrainingSession.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedSession)

      const updateData = { notes: 'Updated session' }
      const result = await trainingSessionRepository.update('sessionId', updateData)

      expect(TrainingSession.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'sessionId' }, updateData, { new: true })
      expect(result).toEqual(mockUpdatedSession)
    })

    it('should return null when updating non-existent session', async () => {
      ;(TrainingSession.findOneAndUpdate as jest.Mock).mockResolvedValue(null)

      const result = await trainingSessionRepository.update('nonexistentId', { notes: 'Update' })

      expect(TrainingSession.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'nonexistentId' },
        { notes: 'Update' },
        { new: true },
      )
      expect(result).toBeNull()
    })

    it('should handle partial updates', async () => {
      const partialUpdate = { type: TrainingTypeEnum.ENDURANCE }
      const updatedSession = { ...mockSession, type: TrainingTypeEnum.ENDURANCE }

      ;(TrainingSession.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedSession)

      const result = await trainingSessionRepository.update('sessionId', partialUpdate)

      expect(TrainingSession.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'sessionId' }, partialUpdate, { new: true })
      expect(result).toEqual(updatedSession)
    })

    it('should handle update errors', async () => {
      const error = new Error('Update failed')
      ;(TrainingSession.findOneAndUpdate as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.update('sessionId', { notes: 'Update' })).rejects.toThrow('Update failed')
    })
  })

  describe('delete', () => {
    it('should delete a session successfully', async () => {
      ;(TrainingSession.findOneAndDelete as jest.Mock).mockResolvedValue(mockSession)

      const result = await trainingSessionRepository.delete('sessionId')

      expect(TrainingSession.findOneAndDelete).toHaveBeenCalledWith({ _id: 'sessionId' })
      expect(result).toEqual(mockSession)
    })

    it('should return null when deleting non-existent session', async () => {
      ;(TrainingSession.findOneAndDelete as jest.Mock).mockResolvedValue(null)

      const result = await trainingSessionRepository.delete('nonexistentId')

      expect(TrainingSession.findOneAndDelete).toHaveBeenCalledWith({ _id: 'nonexistentId' })
      expect(result).toBeNull()
    })

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed')
      ;(TrainingSession.findOneAndDelete as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.delete('sessionId')).rejects.toThrow('Delete failed')
    })
  })

  describe('getTotal', () => {
    it('should get total count with default query', async () => {
      ;(TrainingSession.countDocuments as jest.Mock).mockResolvedValue(5)

      const result = await trainingSessionRepository.getTotal()

      expect(TrainingSession.countDocuments).toHaveBeenCalledWith({})
      expect(result).toBe(5)
    })

    it('should get total count with custom query', async () => {
      const query = { type: TrainingTypeEnum.STRENGTH }
      ;(TrainingSession.countDocuments as jest.Mock).mockResolvedValue(3)

      const result = await trainingSessionRepository.getTotal(query)

      expect(TrainingSession.countDocuments).toHaveBeenCalledWith(query)
      expect(result).toBe(3)
    })

    it('should return 0 when no documents match query', async () => {
      ;(TrainingSession.countDocuments as jest.Mock).mockResolvedValue(0)

      const result = await trainingSessionRepository.getTotal({ athlete: new ObjectId() })

      expect(result).toBe(0)
    })

    it('should handle getTotal errors', async () => {
      const error = new Error('Count failed')
      ;(TrainingSession.countDocuments as jest.Mock).mockRejectedValue(error)

      await expect(trainingSessionRepository.getTotal()).rejects.toThrow('Count failed')
    })
  })
})
