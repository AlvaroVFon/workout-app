import { Types } from 'mongoose'
import { CreateSessionDTO } from '../../../src/DTOs/session/create.dto'
import { SessionDTO } from '../../../src/DTOs/session/session.dto'
import Session from '../../../src/models/Session'
import sessionRepository from '../../../src/repositories/session.repository'

jest.mock('../../../src/models/Session')

describe('SessionRepository', () => {
  const mockSessionId = new Types.ObjectId().toString()
  const mockUserId = new Types.ObjectId().toString()

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

  describe('findById', () => {
    it('should find a session by ID successfully', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findById as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findById(mockSessionId)

      expect(Session.findById).toHaveBeenCalledWith({ _id: mockSessionId }, {})
      expect(result).toEqual(mockSession)
    })

    it('should find a session by ID with custom projection', async () => {
      const projection = { refreshTokenHash: 0 }
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findById as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findById(mockSessionId, projection)

      expect(Session.findById).toHaveBeenCalledWith({ _id: mockSessionId }, projection)
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

  describe('findByUserId', () => {
    it('should find a session by user ID successfully', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findByUserId(mockUserId)

      expect(Session.findOne).toHaveBeenCalledWith({ userId: mockUserId }, {})
      expect(result).toEqual(mockSession)
    })

    it('should return null when no session is found for user', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findByUserId(mockUserId)

      expect(result).toBeNull()
    })
  })

  describe('findAllByUserId', () => {
    it('should find all sessions for a user', async () => {
      const mockSessions = [mockSession, { ...mockSession, _id: new Types.ObjectId() }]
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSessions),
      }
      ;(Session.find as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findAllByUserId(mockUserId)

      expect(Session.find).toHaveBeenCalledWith({ userId: mockUserId }, {})
      expect(result).toEqual(mockSessions)
    })

    it('should return empty array when no sessions found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      ;(Session.find as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findAllByUserId(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('findActiveByUserId', () => {
    it('should find active session for a user', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockSession),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findActiveByUserId(mockUserId)

      expect(Session.findOne).toHaveBeenCalledWith({ userId: mockUserId, isActive: true }, {})
      expect(result).toEqual(mockSession)
    })

    it('should return null when no active session found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(Session.findOne as jest.Mock).mockReturnValue(mockQuery)

      const result = await sessionRepository.findActiveByUserId(mockUserId)

      expect(result).toBeNull()
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
