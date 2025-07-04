import bcrypt from 'bcrypt'
import { invalidateSession, rotateUserSessionAndTokens } from '../../../src/helpers/session.helper'
import AuthService from '../../../src/services/auth.service'
import userService from '../../../src/services/user.service'
import sessionService from '../../../src/services/session.service'
import { refreshTokens, verifyToken } from '../../../src/utils/jwt.utils'
import { Types } from 'mongoose'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/services/session.service')
jest.mock('../../../src/utils/jwt.utils')
jest.mock('../../../src/helpers/session.helper')
jest.mock('bcrypt')

describe('AuthService', () => {
  describe('login', () => {
    it('should return null if user is not found', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toBe(null)
    })

    it('should return null if password is invalid', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue({
        password: 'hashedPassword',
      })
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toBe(null)
    })

    it('should return tokens and full user if login is successful', async () => {
      const user = {
        id: '1',
        name: 'Test User',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: { name: 'user' },
        address: '123 Test St',
        country: 'Testland',
        idDocument: '12345',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const tokens = { token: 'accessToken', refreshToken: 'refreshToken' }

      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)
      ;(rotateUserSessionAndTokens as jest.Mock).mockResolvedValue(tokens)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toEqual({ user: user, token: 'accessToken', refreshToken: 'refreshToken' })
    })
  })

  describe('info', () => {
    it('should return payload if token is valid', async () => {
      const payload = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
      }
      ;(verifyToken as jest.Mock).mockResolvedValue(payload)

      const result = await AuthService.info('validToken')

      expect(result).toEqual(payload)
    })

    it('should return null if token is invalid', async () => {
      ;(verifyToken as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.info('invalidToken')

      expect(result).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const newTokens = { token: 'newAccessToken', refreshToken: 'newRefreshToken' }

      ;(refreshTokens as jest.Mock).mockReturnValue(newTokens)

      const result = await AuthService.refreshTokens('validRefreshToken')

      expect(refreshTokens).toHaveBeenCalledWith('validRefreshToken')
      expect(result).toEqual(newTokens)
    })

    it('should return null when refresh token is invalid', async () => {
      ;(refreshTokens as jest.Mock).mockReturnValue(null)

      const result = await AuthService.refreshTokens('invalidRefreshToken')

      expect(result).toBeNull()
    })

    it('should return null when refresh token verification fails', async () => {
      ;(refreshTokens as jest.Mock).mockReturnValue(null)

      const result = await AuthService.refreshTokens('malformedToken')

      expect(result).toBeNull()
    })
  })

  describe('logout', () => {
    const mockUserId = new Types.ObjectId().toString()
    const mockSessionId = new Types.ObjectId().toString()
    const mockPayload = {
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
      idDocument: '12345',
    }
    const mockSession = {
      _id: new Types.ObjectId(mockSessionId),
      userId: new Types.ObjectId(mockUserId),
      isActive: true,
      expiresAt: new Date(),
      refreshTokenHash: 'hashedToken',
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return true when logout is successful', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(mockPayload)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(mockSession)
      ;(invalidateSession as jest.Mock).mockResolvedValue(mockSession)

      const result = await AuthService.logout('validRefreshToken')

      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken')
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(invalidateSession).toHaveBeenCalledWith(mockSession)
      expect(result).toBe(true)
    })

    it('should return false when token is invalid', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(null)

      const result = await AuthService.logout('invalidToken')

      expect(verifyToken).toHaveBeenCalledWith('invalidToken')
      expect(sessionService.findActiveByUserId).not.toHaveBeenCalled()
      expect(invalidateSession).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should return false when no active session is found', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(mockPayload)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.logout('validRefreshToken')

      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken')
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(invalidateSession).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should handle session invalidation errors', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(mockPayload)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(mockSession)
      ;(invalidateSession as jest.Mock).mockRejectedValue(new Error('Database error'))

      await expect(AuthService.logout('validRefreshToken')).rejects.toThrow('Database error')

      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken')
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(invalidateSession).toHaveBeenCalledWith(mockSession)
    })

    it('should handle token verification errors', async () => {
      ;(verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed')
      })

      await expect(AuthService.logout('malformedToken')).rejects.toThrow('Token verification failed')

      expect(verifyToken).toHaveBeenCalledWith('malformedToken')
      expect(sessionService.findActiveByUserId).not.toHaveBeenCalled()
      expect(invalidateSession).not.toHaveBeenCalled()
    })
  })
})
