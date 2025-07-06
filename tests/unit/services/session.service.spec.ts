import { Types } from 'mongoose'
import { CreateSessionDTO } from '../../../src/DTOs/session/create.dto'
import { SessionDTO } from '../../../src/DTOs/session/session.dto'
import sessionRepository from '../../../src/repositories/session.repository'
import sessionService from '../../../src/services/session.service'

jest.mock('../../../src/repositories/session.repository')

describe('SessionService', () => {
  const mockSessionId = new Types.ObjectId().toString()
  const mockUserId = new Types.ObjectId().toString()
  const mockReplacedById = new Types.ObjectId()

  const mockSessionData: CreateSessionDTO = {
    userId: mockUserId,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    refreshTokenHash: 'hashedRefreshToken',
    isActive: true,
  }

  const mockSession = {
    _id: new Types.ObjectId(mockSessionId),
    userId: new Types.ObjectId(mockUserId),
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    refreshTokenHash: 'hashedRefreshToken',
    isActive: true,
    replacedBy: undefined,
  } as unknown as SessionDTO

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a session successfully', async () => {
      ;(sessionRepository.create as jest.Mock).mockResolvedValue(mockSession)

      const result = await sessionService.create(mockSessionData)

      expect(sessionRepository.create).toHaveBeenCalledWith(mockSessionData)
      expect(result).toEqual(mockSession)
    })

    it('should handle creation errors', async () => {
      const error = new Error('Database error')
      ;(sessionRepository.create as jest.Mock).mockRejectedValue(error)

      await expect(sessionService.create(mockSessionData)).rejects.toThrow('Database error')
    })
  })

  describe('findById', () => {
    it('should find a session by ID successfully', async () => {
      ;(sessionRepository.findById as jest.Mock).mockResolvedValue(mockSession)

      const result = await sessionService.findById(mockSessionId)

      expect(sessionRepository.findById).toHaveBeenCalledWith(mockSessionId, {}, {})
      expect(result).toEqual(mockSession)
    })

    it('should find a session by ID with custom projection', async () => {
      const projection = { refreshTokenHash: 0 }
      ;(sessionRepository.findById as jest.Mock).mockResolvedValue(mockSession)

      const result = await sessionService.findById(mockSessionId, projection)

      expect(sessionRepository.findById).toHaveBeenCalledWith(mockSessionId, projection, {})
      expect(result).toEqual(mockSession)
    })

    it('should return null when session is not found', async () => {
      ;(sessionRepository.findById as jest.Mock).mockResolvedValue(null)

      const result = await sessionService.findById(mockSessionId)

      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should find a session by user ID successfully', async () => {
      ;(sessionRepository.findOne as jest.Mock).mockResolvedValue(mockSession)

      const result = await sessionService.findByUserId(mockUserId)

      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        query: { userId: mockUserId },
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockSession)
    })

    it('should return null when no session is found for user', async () => {
      ;(sessionRepository.findOne as jest.Mock).mockResolvedValue(null)

      const result = await sessionService.findByUserId(mockUserId)

      expect(result).toBeNull()
    })
  })

  describe('findAllByUserId', () => {
    it('should find all sessions for a user', async () => {
      const mockSessions = [mockSession, { ...mockSession, _id: new Types.ObjectId() }]
      ;(sessionRepository.findAll as jest.Mock).mockResolvedValue(mockSessions)

      const result = await sessionService.findAllByUserId(mockUserId)

      expect(sessionRepository.findAll).toHaveBeenCalledWith({
        query: { userId: mockUserId },
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockSessions)
    })

    it('should return empty array when no sessions found', async () => {
      ;(sessionRepository.findAll as jest.Mock).mockResolvedValue([])

      const result = await sessionService.findAllByUserId(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('findActiveByUserId', () => {
    it('should find active session for a user', async () => {
      ;(sessionRepository.findOne as jest.Mock).mockResolvedValue(mockSession)

      const result = await sessionService.findActiveByUserId(mockUserId)

      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        query: { userId: mockUserId, isActive: true },
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockSession)
    })

    it('should return null when no active session found', async () => {
      ;(sessionRepository.findOne as jest.Mock).mockResolvedValue(null)

      const result = await sessionService.findActiveByUserId(mockUserId)

      expect(result).toBeNull()
    })
  })

  describe('update', () => {
    it('should update a session successfully', async () => {
      const updateData = { isActive: false, replacedBy: mockReplacedById } as any
      const updatedSession = { ...mockSession, ...updateData }
      ;(sessionRepository.update as jest.Mock).mockResolvedValue(updatedSession)

      const result = await sessionService.update(mockSessionId, updateData)

      expect(sessionRepository.update).toHaveBeenCalledWith(mockSessionId, updateData)
      expect(result).toEqual(updatedSession)
    })

    it('should return null when session to update is not found', async () => {
      const updateData = { isActive: false }
      ;(sessionRepository.update as jest.Mock).mockResolvedValue(null)

      const result = await sessionService.update(mockSessionId, updateData)

      expect(result).toBeNull()
    })

    it('should handle update errors', async () => {
      const updateData = { isActive: false }
      const error = new Error('Update failed')
      ;(sessionRepository.update as jest.Mock).mockRejectedValue(error)

      await expect(sessionService.update(mockSessionId, updateData)).rejects.toThrow('Update failed')
    })
  })

  describe('delete', () => {
    it('should delete a session successfully', async () => {
      ;(sessionRepository.delete as jest.Mock).mockResolvedValue(mockSession)

      const result = await sessionService.delete(mockSessionId)

      expect(sessionRepository.delete).toHaveBeenCalledWith(mockSessionId)
      expect(result).toEqual(mockSession)
    })

    it('should return null when session to delete is not found', async () => {
      ;(sessionRepository.delete as jest.Mock).mockResolvedValue(null)

      const result = await sessionService.delete(mockSessionId)

      expect(result).toBeNull()
    })

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed')
      ;(sessionRepository.delete as jest.Mock).mockRejectedValue(error)

      await expect(sessionService.delete(mockSessionId)).rejects.toThrow('Delete failed')
    })
  })
})
