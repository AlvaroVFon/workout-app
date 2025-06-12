import AuthService from '../../../src/services/auth.service'
import userService from '../../../src/services/user.service'
import { generateAccessTokens, verifyToken } from '../../../src/utils/jwt.utils'
import bcrypt from 'bcrypt'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/utils/jwt.utils')
jest.mock('bcrypt')

describe('AuthService', () => {
  describe('login', () => {
    it('should return false if user is not found', async () => {
      ;(userService.getByEmail as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toBe(false)
    })

    it('should return false if password is invalid', async () => {
      ;(userService.getByEmail as jest.Mock).mockResolvedValue({ password: 'hashedPassword' })
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toBe(false)
    })

    it('should return tokens if login is successful', async () => {
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        idDocument: '12345',
      }
      const tokens = { token: 'accessToken', refreshToken: 'refreshToken' }

      ;(userService.getByEmail as jest.Mock).mockResolvedValue(user)
      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)
      ;(generateAccessTokens as jest.Mock).mockReturnValue(tokens)

      const result = await AuthService.login('test@example.com', 'password123')

      expect(result).toEqual(tokens)
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
      const payload = { id: '1', name: 'Test User', email: 'test@example.com', idDocument: '12345' }

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
})
