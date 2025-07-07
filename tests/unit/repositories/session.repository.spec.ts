import { ObjectId } from 'mongodb'
import { CreateSessionDTO } from '../../../src/DTOs/session/create.dto'
import { SessionDTO } from '../../../src/DTOs/session/session.dto'
import Session from '../../../src/models/Session'
import sessionRepository from '../../../src/repositories/session.repository'

jest.mock('../../../src/models/Session')

describe('SessionRepository', () => {
  const mockSessionId = new ObjectId().toString()
  const mockUserId = new ObjectId().toString()

  const mockSessionData: CreateSessionDTO = {
    userId: mockUserId,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    refreshTokenHash: 'hashedRefreshToken',
    isActive: true,
  }

  const mockSession = {
    _id: new ObjectId(mockSessionId),
    userId: new ObjectId(mockUserId),
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
      ;(Session.create as jest.Mock).mockResolvedValue(mockSession)
      const result = await sessionRepository.create(mockSessionData)

      expect(Session.create).toHaveBeenCalledWith(mockSessionData)
      expect(result).toEqual(mockSession)
    })

    it('should handle creation errors', async () => {
      const error = new Error('Validation error')
      ;(Session.create as jest.Mock).mockRejectedValue(error)

      await expect(sessionRepository.create(mockSessionData)).rejects.toThrow('Validation error')
    })
  })

  describe('findOne', () => {
    it('should find a session by query successfully', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)
      const result = await sessionRepository.findOne({ query: { userId: mockUserId } })
      expect(Session.findOne).toHaveBeenCalledWith({ userId: mockUserId }, {}, {})
      expect(result).toEqual(mockSession)
    })

    it('should return null when session is not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findOne({ query: { userId: mockUserId } })

      expect(result).toBeNull()
    })

    it('should find a session with custom projection', async () => {
      const projection = { refreshTokenHash: 0 }
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findOne({ query: { userId: mockUserId }, projection })

      expect(Session.findOne).toHaveBeenCalledWith({ userId: mockUserId }, projection, {})
      expect(result).toEqual(mockSession)
    })
  })

  describe('findById', () => {
    it('should find a session by ID successfully', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findById as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findById(mockSessionId)

      expect(Session.findById).toHaveBeenCalledWith(mockSessionId, {}, {})
      expect(result).toEqual(mockSession)
    })

    it('should find a session by ID with custom projection', async () => {
      const projection = { refreshTokenHash: 0 }
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findById as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findById(mockSessionId.toString(), projection)

      expect(Session.findById).toHaveBeenCalledWith(mockSessionId.toString(), projection, {})
      expect(result).toEqual(mockSession)
    })

    it('should return null when session is not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(Session.findById as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findById(mockSessionId)

      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should find all sessions for a user', async () => {
      const mockSessions = [mockSession, { ...mockSession, _id: new ObjectId() }]
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSessions),
      }
      ;(Session.find as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findAll({ query: { userId: mockUserId } })

      expect(Session.find as jest.Mock).toHaveBeenCalledWith({ userId: mockUserId }, {}, {})
      expect(result).toEqual(mockSessions)
    })

    it('should return empty array when no sessions found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      ;(Session.find as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findAll({ query: { userId: mockUserId } })

      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update a session successfully', async () => {
      const updateData = { isActive: false }
      const updatedSession = { ...mockSession, ...updateData }
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(updatedSession),
      }
      ;(Session.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.update(mockSessionId, updateData)

      expect(Session.findByIdAndUpdate).toHaveBeenCalledWith(mockSessionId, updateData, { new: true })
      expect(result).toEqual(updatedSession)
    })

    it('should return null when session to update is not found', async () => {
      const updateData = { isActive: false }
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(Session.findByIdAndUpdate as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.update(mockSessionId, updateData)

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete a session successfully', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findByIdAndDelete as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.delete(mockSessionId)

      expect(Session.findByIdAndDelete).toHaveBeenCalledWith(mockSessionId)
      expect(result).toEqual(mockSession)
    })

    it('should return null when session to delete is not found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(Session.findByIdAndDelete as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.delete(mockSessionId)

      expect(result).toBeNull()
    })
  })
})
