import { Types } from 'mongoose'
import ms from 'ms'
import { parameters } from '../../../src/config/parameters'
import { SessionDTO } from '../../../src/DTOs/session/session.dto'
import { hashString } from '../../../src/helpers/crypto.helper'
import { invalidateSession, rotateSession, rotateUserSessionAndTokens } from '../../../src/helpers/session.helper'
import { Payload } from '../../../src/interfaces/payload.interface'
import sessionService from '../../../src/services/session.service'
import { generateAccessTokens } from '../../../src/utils/jwt.utils'

jest.mock('../../../src/services/session.service')
jest.mock('../../../src/helpers/crypto.helper')
jest.mock('../../../src/utils/jwt.utils')

describe('Session Helper', () => {
  const mockUserId = new Types.ObjectId().toString()
  const mockSessionId = new Types.ObjectId().toString()
  const mockReplacedById = new Types.ObjectId()

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

  const mockNewSession = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(mockUserId),
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    refreshTokenHash: 'newHashedRefreshToken',
    isActive: true,
    replacedBy: undefined,
  } as unknown as SessionDTO

  const mockPayload: Payload = {
    id: mockUserId,
    name: 'Test User',
    email: 'test@example.com',
    idDocument: '12345',
  }

  const originalJwtRefreshExpiration = parameters.jwtRefreshExpiration

  beforeEach(() => {
    jest.clearAllMocks()
    parameters.jwtRefreshExpiration = String(originalJwtRefreshExpiration)
  })

  afterEach(() => {
    parameters.jwtRefreshExpiration = originalJwtRefreshExpiration
  })

  describe('invalidateSession', () => {
    it('should invalidate a session without replacement', async () => {
      const updatedSession = { ...mockSession, isActive: false }
      ;(sessionService.update as jest.Mock).mockResolvedValue(updatedSession)

      const result = await invalidateSession(mockSession)

      expect(sessionService.update).toHaveBeenCalledWith(mockSessionId, {
        isActive: false,
        replacedBy: undefined,
      })
      expect(result).toEqual(updatedSession)
    })

    it('should invalidate a session with replacement', async () => {
      const updatedSession = { ...mockSession, isActive: false, replacedBy: mockNewSession._id }
      ;(sessionService.update as jest.Mock).mockResolvedValue(updatedSession)

      const result = await invalidateSession(mockSession, mockNewSession)

      expect(sessionService.update).toHaveBeenCalledWith(mockSessionId, {
        isActive: false,
        replacedBy: mockNewSession._id,
      })
      expect(result).toEqual(updatedSession)
    })

    it('should handle invalidation errors', async () => {
      const error = new Error('Update failed')
      ;(sessionService.update as jest.Mock).mockRejectedValue(error)

      await expect(invalidateSession(mockSession)).rejects.toThrow('Update failed')
    })
  })

  describe('rotateSession', () => {
    it('should rotate a session by marking it as expired', async () => {
      const rotatedSession = {
        ...mockSession,
        isActive: false,
        replacedBy: mockNewSession._id,
        expiresAt: expect.any(Number),
      }
      ;(sessionService.update as jest.Mock).mockResolvedValue(rotatedSession)

      const result = await rotateSession(mockSession, mockNewSession)

      expect(sessionService.update).toHaveBeenCalledWith(mockSessionId, {
        isActive: false,
        replacedBy: mockNewSession._id,
        expiresAt: expect.any(Number),
      })
      expect(result).toEqual(rotatedSession)

      const updateCall = (sessionService.update as jest.Mock).mock.calls[0][1]
      const expiresAt = updateCall.expiresAt
      expect(typeof expiresAt).toBe('number')
      expect(expiresAt).toBeLessThanOrEqual(Date.now())
    })

    it('should handle rotation errors', async () => {
      const error = new Error('Rotation failed')
      ;(sessionService.update as jest.Mock).mockRejectedValue(error)

      await expect(rotateSession(mockSession, mockNewSession)).rejects.toThrow('Rotation failed')
    })
  })

  describe('rotateUserSessionAndTokens', () => {
    const mockTokens = {
      token: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    }

    it('should create new tokens and session when no old session exists', async () => {
      ;(generateAccessTokens as jest.Mock).mockReturnValue(mockTokens)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(null)
      ;(hashString as jest.Mock).mockResolvedValue('hashedNewRefreshToken')
      ;(sessionService.create as jest.Mock).mockResolvedValue(mockNewSession)

      const result = await rotateUserSessionAndTokens(mockPayload)

      expect(generateAccessTokens).toHaveBeenCalledWith({
        id: mockPayload.id,
        name: mockPayload.name,
        email: mockPayload.email,
        idDocument: mockPayload.idDocument,
      })
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(hashString).toHaveBeenCalledWith('newRefreshToken', 'sha256')
      expect(sessionService.create).toHaveBeenCalledWith({
        userId: mockUserId,
        isActive: true,
        expiresAt: expect.any(Number),
        refreshTokenHash: 'hashedNewRefreshToken',
      })
      expect(result).toEqual(mockTokens)
    })

    it('should rotate old session when it exists', async () => {
      ;(generateAccessTokens as jest.Mock).mockReturnValue(mockTokens)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(mockSession)
      ;(hashString as jest.Mock).mockResolvedValue('hashedNewRefreshToken')
      ;(sessionService.create as jest.Mock).mockResolvedValue(mockNewSession)
      ;(sessionService.update as jest.Mock).mockResolvedValue({ ...mockSession, isActive: false })

      const result = await rotateUserSessionAndTokens(mockPayload)

      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(sessionService.create).toHaveBeenCalledWith({
        userId: mockUserId,
        isActive: true,
        expiresAt: expect.any(Number),
        refreshTokenHash: 'hashedNewRefreshToken',
      })
      expect(sessionService.update).toHaveBeenCalledWith(mockSessionId, {
        isActive: false,
        replacedBy: mockNewSession._id,
        expiresAt: expect.any(Number),
      })
      expect(result).toEqual(mockTokens)
    })

    it('should create session with correct expiration time', async () => {
      parameters.jwtRefreshExpiration = '30d'
      ;(generateAccessTokens as jest.Mock).mockReturnValue(mockTokens)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(null)
      ;(hashString as jest.Mock).mockResolvedValue('hashedNewRefreshToken')
      ;(sessionService.create as jest.Mock).mockResolvedValue(mockNewSession)

      await rotateUserSessionAndTokens(mockPayload)

      const createCall = (sessionService.create as jest.Mock).mock.calls[0][0]
      const expiresAt = createCall.expiresAt
      expect(typeof expiresAt).toBe('number')
      const expirationMs = ms(String(parameters.jwtRefreshExpiration) as ms.StringValue)
      const expectedExpiration = Date.now() + expirationMs
      const timeDiff = Math.abs(expiresAt - expectedExpiration)
      expect(timeDiff).toBeLessThan(1000)
    })

    it('should handle token generation errors', async () => {
      const error = new Error('Token generation failed')
      ;(generateAccessTokens as jest.Mock).mockImplementation(() => {
        throw error
      })

      await expect(rotateUserSessionAndTokens(mockPayload)).rejects.toThrow('Token generation failed')
    })

    it('should handle session creation errors', async () => {
      const error = new Error('Session creation failed')
      ;(generateAccessTokens as jest.Mock).mockReturnValue(mockTokens)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(null)
      ;(hashString as jest.Mock).mockResolvedValue('hashedNewRefreshToken')
      ;(sessionService.create as jest.Mock).mockRejectedValue(error)

      await expect(rotateUserSessionAndTokens(mockPayload)).rejects.toThrow('Session creation failed')
    })

    it('should handle old session rotation errors', async () => {
      const error = new Error('Session rotation failed')
      ;(generateAccessTokens as jest.Mock).mockReturnValue(mockTokens)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(mockSession)
      ;(hashString as jest.Mock).mockResolvedValue('hashedNewRefreshToken')
      ;(sessionService.create as jest.Mock).mockResolvedValue(mockNewSession)
      ;(sessionService.update as jest.Mock).mockRejectedValue(error)

      await expect(rotateUserSessionAndTokens(mockPayload)).rejects.toThrow('Session rotation failed')
    })

    it('should clean payload by removing type field if present', async () => {
      const payloadWithType = { ...mockPayload, type: 'refresh' } as any
      ;(generateAccessTokens as jest.Mock).mockReturnValue(mockTokens)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(null)
      ;(hashString as jest.Mock).mockResolvedValue('hashedNewRefreshToken')
      ;(sessionService.create as jest.Mock).mockResolvedValue(mockNewSession)

      await rotateUserSessionAndTokens(payloadWithType)

      expect(generateAccessTokens).toHaveBeenCalledWith({
        id: mockPayload.id,
        name: mockPayload.name,
        email: mockPayload.email,
        idDocument: mockPayload.idDocument,
      })
      expect(generateAccessTokens).not.toHaveBeenCalledWith(expect.objectContaining({ type: expect.anything() }))
    })
  })
})
