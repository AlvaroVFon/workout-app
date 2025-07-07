import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'
import { invalidateSession, isActiveSession, rotateUserSessionAndTokens } from '../../../src/helpers/session.helper'
import AuthService from '../../../src/services/auth.service'
import sessionService from '../../../src/services/session.service'
import userService from '../../../src/services/user.service'
import { refreshTokens, verifyToken } from '../../../src/utils/jwt.utils'
import codeService from '../../../src/services/code.service'
import mailService from '../../../src/services/mail.service'
import TooManyRequestException from '../../../src/exceptions/TooManyRequestException'
import { CodeType } from '../../../src/utils/enums/code.enum'
import NotFoundException from '../../../src/exceptions/NotFoundException'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/services/session.service')
jest.mock('../../../src/utils/jwt.utils')
jest.mock('../../../src/helpers/session.helper')
jest.mock('bcrypt')
jest.mock('../../../src/services/code.service')
jest.mock('../../../src/services/mail.service')

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
        id: new ObjectId(),
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

  describe('refreshTokens', () => {
    beforeEach(() => {
      ;(isActiveSession as jest.Mock).mockReturnValue(true)
    })

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

    it('should return error when isActiveSession throws an error', async () => {
      ;(isActiveSession as jest.Mock).mockRejectedValue(new Error('Inactive session'))

      await expect(AuthService.refreshTokens('validRefreshToken')).rejects.toThrow('Inactive session')

      expect(isActiveSession).toHaveBeenCalledWith('validRefreshToken')
      expect(refreshTokens).not.toHaveBeenCalled()
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

  describe('forgotPassword', () => {
    const user = { id: 'userId', email: 'user@example.com' }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should not send email if user not found', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(null)
      await AuthService.forgotPassword('user@example.com')
      expect(mailService.sendMail).not.toHaveBeenCalled()
    })

    it('should throw TooManyRequestException if last code was sent recently', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(codeService.findLastByUserIdAndType as jest.Mock).mockResolvedValue({
        createdAt: Date.now(),
      })

      await expect(AuthService.forgotPassword(user.email)).rejects.toThrow(TooManyRequestException)
    })

    it('should create and send a recovery code', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(codeService.findLastByUserIdAndType as jest.Mock).mockResolvedValue(null)
      ;(codeService.create as jest.Mock).mockResolvedValue({ code: '123456' })

      await AuthService.forgotPassword(user.email)

      expect(codeService.create).toHaveBeenCalledWith(user.id, CodeType.RECOVERY)
      expect(mailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: 'Password Recovery',
        }),
      )
    })
  })

  describe('resetPassword', () => {
    const user = { id: 'userId', email: 'user@example.com' }
    const code = '123456'
    const password = 'newPassword'

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return false if user not found', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(null)
      const result = await AuthService.resetPassword(user.email, code, password)
      expect(result).toBe(false)
    })

    it('should throw NotFoundException if code is invalid', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(codeService.isCodeValid as jest.Mock).mockResolvedValue(false)

      await expect(AuthService.resetPassword(user.email, code, password)).rejects.toThrow(NotFoundException)
    })

    it('should reset password and invalidate code if code is valid', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(codeService.isCodeValid as jest.Mock).mockResolvedValue(true)

      const result = await AuthService.resetPassword(user.email, code, password)

      expect(codeService.invalidateCode).toHaveBeenCalledWith(code, user.id)
      expect(userService.update).toHaveBeenCalledWith(user.id, { password })
      expect(result).toBe(true)
    })
  })
})
