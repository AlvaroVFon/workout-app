import bcrypt from 'bcrypt'
import AuthService from '../../../src/services/auth.service'
import userService from '../../../src/services/user.service'
import { generateAccessTokens, verifyToken } from '../../../src/utils/jwt.utils'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/utils/jwt.utils')
jest.mock('bcrypt')

describe('AuthService', () => {
  describe('login', () => {
    it('should return false if user is not found', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toBe(false)
    })

    it('should return false if password is invalid', async () => {
      ;(userService.findByEmail as jest.Mock).mockResolvedValue({
        password: 'hashedPassword',
      })
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toBe(false)
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const tokens = { token: 'accessToken', refreshToken: 'refreshToken' }

      ;(userService.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)
      ;(generateAccessTokens as jest.Mock).mockReturnValue(tokens)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toEqual({ user: user, token: 'accessToken', refreshToken: 'refreshToken' })
    })
  })

  describe('verifyPassword', () => {
    it('should return true if password matches', () => {
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

      const result = AuthService.verifyPassword('password123', 'hashedPassword')

      expect(result).toBe(true)
    })

    it('should return false if password does not match', () => {
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = AuthService.verifyPassword('password123', 'hashedPassword')

      expect(result).toBe(false)
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
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should return null if refresh token is invalid', async () => {
      ;(verifyToken as jest.Mock).mockReturnValue(null)

      const result = await AuthService.refreshToken('invalidRefreshToken')

      expect(result).toBeNull()
      expect(verifyToken).toHaveBeenCalledWith('invalidRefreshToken')
    })

    it('should return null if user no longer exists', async () => {
      const payload = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
      }
      ;(verifyToken as jest.Mock).mockReturnValue(payload)
      ;(userService.findById as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.refreshToken('validRefreshToken')

      expect(result).toBeNull()
      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken')
      expect(userService.findById).toHaveBeenCalledWith('1')
    })

    it('should return new tokens if refresh token is valid and user exists', async () => {
      const payload = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
      }
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
        password: 'hashedPassword',
      }
      const newTokens = { token: 'newAccessToken', refreshToken: 'newRefreshToken' }

      ;(verifyToken as jest.Mock).mockReturnValue(payload)
      ;(userService.findById as jest.Mock).mockResolvedValue(user)
      ;(generateAccessTokens as jest.Mock).mockReturnValue(newTokens)

      const result = await AuthService.refreshToken('validRefreshToken')

      expect(result).toEqual(newTokens)
      expect(verifyToken).toHaveBeenCalledWith('validRefreshToken')
      expect(userService.findById).toHaveBeenCalledWith('1')
      expect(generateAccessTokens).toHaveBeenCalledWith({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
      })
    })

    it('should generate new tokens each time (token rotation)', async () => {
      const payload = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
      }
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        idDocument: '12345',
        password: 'hashedPassword',
      }
      const firstTokens = { token: 'firstAccessToken', refreshToken: 'firstRefreshToken' }
      const secondTokens = { token: 'secondAccessToken', refreshToken: 'secondRefreshToken' }

      ;(verifyToken as jest.Mock).mockReturnValue(payload)
      ;(userService.findById as jest.Mock).mockResolvedValue(user)
      ;(generateAccessTokens as jest.Mock).mockReturnValueOnce(firstTokens).mockReturnValueOnce(secondTokens)

      const firstResult = await AuthService.refreshToken('validRefreshToken')
      const secondResult = await AuthService.refreshToken('validRefreshToken')

      expect(firstResult).toEqual(firstTokens)
      expect(secondResult).toEqual(secondTokens)
      expect(firstResult?.refreshToken).not.toBe(secondResult?.refreshToken)
      expect(generateAccessTokens).toHaveBeenCalledTimes(2)
    })
  })
})
