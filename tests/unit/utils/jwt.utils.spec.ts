import jwt from 'jsonwebtoken'
import { generateToken, generateRefreshToken, generateAccessTokens, verifyToken } from '../../../src/utils/jwt.utils'
import { parameters } from '../../../src/config/parameters'
import { Payload } from '../../../src/interfaces/payload.interface'

jest.mock('jsonwebtoken')

const mockPayload: Payload = { id: '12345', name: 'user', email: 'alvaro@email.com', idDocument: '1234545453' }
const mockToken = 'mockToken'
const mockRefreshToken = 'mockRefreshToken'

describe('JWT Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateToken', () => {
    it('should generate a token with the correct payload and expiration', () => {
      ;(jwt.sign as jest.Mock).mockReturnValue(mockToken)

      const token = generateToken(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, parameters.jwtSecret, { expiresIn: parameters.jwtExpiration })
      expect(token).toBe(mockToken)
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate a refresh token with the correct payload and expiration', () => {
      ;(jwt.sign as jest.Mock).mockReturnValue(mockRefreshToken)

      const refreshToken = generateRefreshToken(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, parameters.jwtSecret, {
        expiresIn: parameters.jwtRefreshExpiration,
      })
      expect(refreshToken).toBe(mockRefreshToken)
    })
  })

  describe('generateAccessTokens', () => {
    it('should generate both access and refresh tokens', () => {
      ;(jwt.sign as jest.Mock).mockReturnValueOnce(mockToken).mockReturnValueOnce(mockRefreshToken)

      const tokens = generateAccessTokens(mockPayload)

      expect(tokens).toEqual({ token: mockToken, refreshToken: mockRefreshToken })
    })
  })

  describe('verifyToken', () => {
    it('should return the decoded payload if the token is valid', () => {
      ;(jwt.verify as jest.Mock).mockReturnValue(mockPayload)

      const decoded = verifyToken(mockToken)

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, parameters.jwtSecret)
      expect(decoded).toEqual(mockPayload)
    })

    it('should return null if the token is invalid', () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const decoded = verifyToken(mockToken)

      expect(decoded).toBeNull()
    })
  })
})
