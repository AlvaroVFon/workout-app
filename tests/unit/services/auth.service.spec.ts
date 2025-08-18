import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'
import NotFoundException from '../../../src/exceptions/NotFoundException'
import TooManyRequestException from '../../../src/exceptions/TooManyRequestException'
import { invalidateSession, isActiveSession, rotateUserSessionAndTokens } from '../../../src/helpers/session.helper'
import { Payload } from '../../../src/interfaces/payload.interface'
import { enqueueEmailJob } from '../../../src/queueSystem/jobs/email/email.job'
import AuthService from '../../../src/services/auth.service'
import codeService from '../../../src/services/code.service'
import mailService from '../../../src/services/mail.service'
import sessionService from '../../../src/services/session.service'
import userService from '../../../src/services/user.service'
import { CodeType } from '../../../src/utils/enums/code.enum'
import { TokenTypeEnum } from '../../../src/utils/enums/token.enum'
import { generateResetPasswordToken, refreshTokens, verifyToken } from '../../../src/utils/jwt.utils'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/services/session.service')
jest.mock('../../../src/utils/jwt.utils')
jest.mock('../../../src/helpers/session.helper')
jest.mock('bcrypt')
jest.mock('../../../src/services/code.service')
jest.mock('../../../src/services/mail.service')
jest.mock('../../../src/queueSystem/jobs/email/email.job')

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
        type: TokenTypeEnum.ACCESS,
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
      type: TokenTypeEnum.ACCESS,
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

      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken', TokenTypeEnum.REFRESH)
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(invalidateSession).toHaveBeenCalledWith(mockSession)
      expect(result).toBe(true)
    })

    it('should return false when token is invalid', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(null)

      const result = await AuthService.logout('invalidToken')

      expect(verifyToken).toHaveBeenCalledWith('invalidToken', TokenTypeEnum.REFRESH)
      expect(sessionService.findActiveByUserId).not.toHaveBeenCalled()
      expect(invalidateSession).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should return false when no active session is found', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(mockPayload)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.logout('validRefreshToken')

      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken', TokenTypeEnum.REFRESH)
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(invalidateSession).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should handle session invalidation errors', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(mockPayload)
      ;(sessionService.findActiveByUserId as jest.Mock).mockResolvedValue(mockSession)
      ;(invalidateSession as jest.Mock).mockRejectedValue(new Error('Database error'))

      await expect(AuthService.logout('validRefreshToken')).rejects.toThrow('Database error')

      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken', TokenTypeEnum.REFRESH)
      expect(sessionService.findActiveByUserId).toHaveBeenCalledWith(mockUserId)
      expect(invalidateSession).toHaveBeenCalledWith(mockSession)
    })

    it('should handle token verification errors', async () => {
      ;(verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed')
      })

      await expect(AuthService.logout('malformedToken')).rejects.toThrow('Token verification failed')

      expect(verifyToken).toHaveBeenCalledWith('malformedToken', TokenTypeEnum.REFRESH)
      expect(sessionService.findActiveByUserId).not.toHaveBeenCalled()
      expect(invalidateSession).not.toHaveBeenCalled()
    })
  })

  describe('forgotPassword', () => {
    const user = { id: new ObjectId(), email: 'user@example.com' }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should create and send a recovery code', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(codeService.verifyLastCodeInterval as jest.Mock).mockResolvedValue(true)
      ;(codeService.findLastByUserIdAndType as jest.Mock).mockResolvedValue(null)
      ;(codeService.create as jest.Mock).mockResolvedValue({ code: '123456', type: CodeType.RECOVERY })
      ;(generateResetPasswordToken as jest.Mock).mockReturnValue('resetToken')
      ;(enqueueEmailJob as jest.Mock).mockResolvedValue(undefined)

      await AuthService.forgotPassword(user.email)

      expect(codeService.create).toHaveBeenCalledWith(user.id, CodeType.RECOVERY)
      expect(enqueueEmailJob).toHaveBeenCalledWith({
        payload: { code: '123456', resetPasswordToken: 'resetToken', to: 'user@example.com' },
        template: 'password-recovery',
        type: 'email',
      })
    })

    it('should not send email if user not found', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(null)
      await AuthService.forgotPassword('user@example.com')
      expect(mailService.sendMail).not.toHaveBeenCalled()
    })

    it('should throw TooManyRequestException if last code was sent recently', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(codeService.verifyLastCodeInterval as jest.Mock).mockResolvedValue(false)
      ;(codeService.findLastByUserIdAndType as jest.Mock).mockResolvedValue({
        createdAt: Date.now(),
      })

      await expect(AuthService.forgotPassword(user.email)).rejects.toThrow(TooManyRequestException)
    })
  })

  describe('resetPassword', () => {
    const user = { id: new ObjectId(), email: 'user@example.com' }
    const code = '123456'
    const password = 'newPassword'

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return false if user not found', async () => {
      const payload: Payload = {
        id: user.id.toString(),
        email: user.email,
        type: TokenTypeEnum.RESET_PASSWORD,
        name: 'Test User',
        idDocument: '1231231',
      }
      const token = generateResetPasswordToken(payload)

      ;(verifyToken as jest.Mock).mockReturnValue(null)
      ;(userService.findById as jest.Mock).mockResolvedValue(null)
      const result = await AuthService.resetPassword(token, code, password)
      expect(result).toBe(false)
    })

    it('should throw NotFoundException if code is invalid', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue({ id: user.id })
      ;(userService.findById as jest.Mock).mockResolvedValue(user)
      ;(codeService.isCodeValid as jest.Mock).mockResolvedValue(false)

      await expect(AuthService.resetPassword(user.email, code, password)).rejects.toThrow(NotFoundException)
    })

    it('should reset password and invalidate code if code is valid', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue({ id: user.id })
      ;(userService.findById as jest.Mock).mockResolvedValue(user)
      ;(codeService.isCodeValid as jest.Mock).mockResolvedValue(true)
      ;(enqueueEmailJob as jest.Mock).mockResolvedValue(undefined)

      const result = await AuthService.resetPassword(user.email, code, password)

      expect(codeService.invalidateCode).toHaveBeenCalledWith(code, user.id)
      expect(userService.update).toHaveBeenCalledWith(user.id, { password })
      expect(enqueueEmailJob).toHaveBeenCalledWith({
        payload: { to: 'user@example.com' },
        template: 'reset-password-succeed',
        type: 'email',
      })
      expect(result).toBe(true)
    })
  })
})
