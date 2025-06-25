import trainingSessionService from '../../../src/services/trainingSession.service'
import trainingSessionRepository from '../../../src/repositories/trainingSession.repository'
import { TrainingSessionDTO } from '../../../src/DTOs/trainingSession/trainingSession.dto'
import { ObjectId } from 'mongodb'
import { TrainingTypeEnum } from '../../../src/utils/enums/trainingTypes.enum'

// Mock the repository
jest.mock('../../../src/repositories/trainingSession.repository')

const mockTrainingSessionRepository = trainingSessionRepository as jest.Mocked<typeof trainingSessionRepository>

describe('TrainingSession Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a training session', async () => {
      const trainingSessionData: TrainingSessionDTO = {
        athlete: new ObjectId(),
        date: new Date(),
        type: TrainingTypeEnum.STRENGTH,
        exercises: [
          {
            exercise: new ObjectId(),
            sets: [
              { reps: 10, weight: 75, rir: 2 },
              { reps: 8, weight: 80, rir: 1 },
            ],
          },
        ],
        notes: 'Great workout today',
        week: 15,
        month: 4,
        year: 2024,
        tags: ['gym', 'strength'],
      }

      const mockCreatedSession = { _id: new ObjectId(), ...trainingSessionData }
      mockTrainingSessionRepository.create.mockResolvedValue(mockCreatedSession as never)

      const result = await trainingSessionService.create(trainingSessionData)

      expect(mockTrainingSessionRepository.create).toHaveBeenCalledWith(trainingSessionData)
      expect(result).toEqual(mockCreatedSession)
    })

    it('should handle repository errors during creation', async () => {
      const trainingSessionData: TrainingSessionDTO = {
        athlete: new ObjectId(),
        date: new Date(),
        type: TrainingTypeEnum.ENDURANCE,
        exercises: [],
        notes: 'Test session',
        week: 1,
        month: 1,
        year: 2024,
        tags: [],
      }

      const error = new Error('Database error')
      mockTrainingSessionRepository.create.mockRejectedValue(error)

      await expect(trainingSessionService.create(trainingSessionData)).rejects.toThrow('Database error')
      expect(mockTrainingSessionRepository.create).toHaveBeenCalledWith(trainingSessionData)
    })
  })

  describe('findOne', () => {
    it('should find one training session with default parameters', async () => {
      const mockSession = { _id: new ObjectId(), athlete: new ObjectId() }
      mockTrainingSessionRepository.findOne.mockResolvedValue(mockSession as never)

      const result = await trainingSessionService.findOne()

      expect(mockTrainingSessionRepository.findOne).toHaveBeenCalledWith({
        query: {},
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockSession)
    })

    it('should find one training session with custom parameters', async () => {
      const query = { athlete: new ObjectId() }
      const projection = { notes: 0 }
      const options = { populate: 'athlete' }
      const mockSession = { _id: new ObjectId(), athlete: new ObjectId() }

      mockTrainingSessionRepository.findOne.mockResolvedValue(mockSession as never)

      const result = await trainingSessionService.findOne({ query, projection, options })

      expect(mockTrainingSessionRepository.findOne).toHaveBeenCalledWith({
        query,
        projection,
        options,
      })
      expect(result).toEqual(mockSession)
    })

    it('should return null when session is not found', async () => {
      mockTrainingSessionRepository.findOne.mockResolvedValue(null)

      const result = await trainingSessionService.findOne({ query: { _id: new ObjectId() } })

      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should find all training sessions with default parameters', async () => {
      const mockSessions = [
        { _id: new ObjectId(), athlete: new ObjectId() },
        { _id: new ObjectId(), athlete: new ObjectId() },
      ]
      mockTrainingSessionRepository.findAll.mockResolvedValue(mockSessions as never)

      const result = await trainingSessionService.findAll()

      expect(mockTrainingSessionRepository.findAll).toHaveBeenCalledWith({
        query: {},
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockSessions)
    })

    it('should find all training sessions with custom parameters', async () => {
      const query = { type: TrainingTypeEnum.STRENGTH }
      const projection = { notes: 0 }
      const options = { sort: { date: -1 }, limit: 10 }
      const mockSessions = [{ _id: new ObjectId(), type: TrainingTypeEnum.STRENGTH }]

      mockTrainingSessionRepository.findAll.mockResolvedValue(mockSessions as never)

      const result = await trainingSessionService.findAll({ query, projection, options })

      expect(mockTrainingSessionRepository.findAll).toHaveBeenCalledWith({
        query,
        projection,
        options,
      })
      expect(result).toEqual(mockSessions)
    })

    it('should return empty array when no sessions found', async () => {
      mockTrainingSessionRepository.findAll.mockResolvedValue([])

      const result = await trainingSessionService.findAll()

      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update a training session', async () => {
      const sessionId = new ObjectId().toString()
      const updateData = {
        notes: 'Updated notes',
        type: TrainingTypeEnum.MOBILITY,
      }
      const mockUpdatedSession = { _id: sessionId, ...updateData }

      mockTrainingSessionRepository.update.mockResolvedValue(mockUpdatedSession as never)

      const result = await trainingSessionService.update(sessionId, updateData)

      expect(mockTrainingSessionRepository.update).toHaveBeenCalledWith(sessionId, updateData)
      expect(result).toEqual(mockUpdatedSession)
    })

    it('should handle repository errors during update', async () => {
      const sessionId = new ObjectId().toString()
      const updateData = { notes: 'Updated notes' }
      const error = new Error('Update failed')

      mockTrainingSessionRepository.update.mockRejectedValue(error)

      await expect(trainingSessionService.update(sessionId, updateData)).rejects.toThrow('Update failed')
      expect(mockTrainingSessionRepository.update).toHaveBeenCalledWith(sessionId, updateData)
    })
  })

  describe('delete', () => {
    it('should delete a training session', async () => {
      const sessionId = new ObjectId().toString()
      const mockDeletedSession = { _id: sessionId, deleted: true }

      mockTrainingSessionRepository.delete.mockResolvedValue(mockDeletedSession as never)

      const result = await trainingSessionService.delete(sessionId)

      expect(mockTrainingSessionRepository.delete).toHaveBeenCalledWith(sessionId)
      expect(result).toEqual(mockDeletedSession)
    })

    it('should handle repository errors during deletion', async () => {
      const sessionId = new ObjectId().toString()
      const error = new Error('Delete failed')

      mockTrainingSessionRepository.delete.mockRejectedValue(error)

      await expect(trainingSessionService.delete(sessionId)).rejects.toThrow('Delete failed')
      expect(mockTrainingSessionRepository.delete).toHaveBeenCalledWith(sessionId)
    })
  })

  describe('getTotal', () => {
    it('should get total count with default query', async () => {
      const mockTotal = 25
      mockTrainingSessionRepository.getTotal.mockResolvedValue(mockTotal)

      const result = await trainingSessionService.getTotal()

      expect(mockTrainingSessionRepository.getTotal).toHaveBeenCalledWith({})
      expect(result).toBe(mockTotal)
    })

    it('should get total count with custom query', async () => {
      const query = { athlete: new ObjectId() }
      const mockTotal = 5
      mockTrainingSessionRepository.getTotal.mockResolvedValue(mockTotal)

      const result = await trainingSessionService.getTotal(query)

      expect(mockTrainingSessionRepository.getTotal).toHaveBeenCalledWith(query)
      expect(result).toBe(mockTotal)
    })

    it('should return 0 when no documents match query', async () => {
      const query = { athlete: new ObjectId() }
      mockTrainingSessionRepository.getTotal.mockResolvedValue(0)

      const result = await trainingSessionService.getTotal(query)

      expect(result).toBe(0)
    })

    it('should handle repository errors during getTotal', async () => {
      const error = new Error('Count failed')
      mockTrainingSessionRepository.getTotal.mockRejectedValue(error)

      await expect(trainingSessionService.getTotal()).rejects.toThrow('Count failed')
      expect(mockTrainingSessionRepository.getTotal).toHaveBeenCalledWith({})
    })
  })
})
