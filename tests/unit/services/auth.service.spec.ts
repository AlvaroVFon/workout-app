import bcrypt from 'bcrypt'
import AuthService from '../../../src/services/auth.service'
import userService from '../../../src/services/user.service'
import { generateAccessTokens, refreshToken, verifyToken } from '../../../src/utils/jwt.utils'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/utils/jwt.utils')
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

      ;(refreshToken as jest.Mock).mockReturnValue(newTokens)

      const result = await AuthService.refreshToken('validRefreshToken')

      expect(refreshToken).toHaveBeenCalledWith('validRefreshToken')
      expect(result).toEqual(newTokens)
    })

    it('should return null when refresh token is invalid', async () => {
      ;(refreshToken as jest.Mock).mockReturnValue(null)

      const result = await AuthService.refreshToken('invalidRefreshToken')

      expect(result).toBeNull()
    })

    it('should return null when refresh token verification fails', async () => {
      ;(refreshToken as jest.Mock).mockReturnValue(null)

      const result = await AuthService.refreshToken('malformedToken')

      expect(result).toBeNull()
    })
  })
})
