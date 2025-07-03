import jwt from 'jsonwebtoken'
import { parameters } from '../../../src/config/parameters'
import { Payload } from '../../../src/interfaces/payload.interface'
import {
  generateAccessTokens,
  generateRefreshToken,
  generateToken,
  refreshTokens,
  verifyRefreshToken,
  verifyToken,
} from '../../../src/utils/jwt.utils'
import { rotateUserSessionAndTokens } from '../../../src/helpers/session.helper'

jest.mock('jsonwebtoken')
jest.mock('../../../src/helpers/session.helper', () => ({
  rotateUserSessionAndTokens: jest.fn(),
}))

const mockPayload: Payload = {
  id: '12345',
  name: 'user',
  email: 'alvaro@email.com',
  idDocument: '1234545453',
  type: 'access',
}

const mockRefreshPayload: Payload = {
  ...mockPayload,
  type: 'refresh',
}

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

      expect(jwt.sign).toHaveBeenCalledWith(mockRefreshPayload, parameters.jwtSecret, {
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

  describe('verifyRefreshToken', () => {
    it('should return the decoded payload if the refresh token is valid', () => {
      ;(jwt.verify as jest.Mock).mockReturnValue(mockRefreshPayload)

      const decoded = verifyRefreshToken(mockRefreshToken)

      expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, parameters.jwtSecret)
      expect(decoded).toEqual(mockRefreshPayload)
    })

    it('should return null if the refresh token is invalid', () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const decoded = verifyRefreshToken(mockRefreshToken)

      expect(decoded).toBeNull()
    })

    it('should return null if trying to use an access token as refresh token', () => {
      // Mock an access token payload (type: 'access')
      const accessTokenPayload = { ...mockPayload, type: 'access' }
      ;(jwt.verify as jest.Mock).mockReturnValue(accessTokenPayload)

      const decoded = verifyRefreshToken('accessTokenUsedAsRefresh')

      expect(decoded).toBeNull()
    })

    it('should return null if token has no type property', () => {
      const tokenWithoutType = { ...mockPayload }
      delete tokenWithoutType.type
      ;(jwt.verify as jest.Mock).mockReturnValue(tokenWithoutType)

      const decoded = verifyRefreshToken('tokenWithoutType')

      expect(decoded).toBeNull()
    })

    it('should return null if token has incorrect type', () => {
      const tokenWithWrongType = { ...mockPayload, type: 'invalidType' }
      ;(jwt.verify as jest.Mock).mockReturnValue(tokenWithWrongType)

      const decoded = verifyRefreshToken('tokenWithWrongType')

      expect(decoded).toBeNull()
    })
  })

  describe('Token Type Validation Edge Cases', () => {
    it('should reject refresh token when used with verifyToken if it has type validation', () => {
      ;(jwt.verify as jest.Mock).mockReturnValue(mockRefreshPayload)

      const decoded = verifyToken('refreshTokenUsedAsAccess')

      expect(decoded).toEqual(mockRefreshPayload)
    })

    it('should handle malformed token gracefully', () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Malformed token')
      })

      const accessDecoded = verifyToken('malformedToken')
      const refreshDecoded = verifyRefreshToken('malformedToken')

      expect(accessDecoded).toBeNull()
      expect(refreshDecoded).toBeNull()
    })

    it('should handle expired token gracefully', () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date())
      })

      const accessDecoded = verifyToken('expiredToken')
      const refreshDecoded = verifyRefreshToken('expiredToken')

      expect(accessDecoded).toBeNull()
      expect(refreshDecoded).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('should return new tokens when valid refresh token is provided', async () => {
      const newTokens = { token: 'newAccessToken', refreshToken: 'newRefreshToken' }

      ;(jwt.verify as jest.Mock).mockReturnValue(mockRefreshPayload)
      ;(rotateUserSessionAndTokens as jest.Mock).mockResolvedValue(newTokens)

      const result = await refreshTokens('validRefreshToken')

      expect(result).toEqual(newTokens)
    })

    it('should return null when invalid refresh token is provided', async () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = await refreshTokens('invalidRefreshToken')

      expect(result).toBeNull()
    })

    it('should return null when access token is used as refresh token', async () => {
      const accessTokenPayload = { ...mockPayload, type: 'access' }
      ;(jwt.verify as jest.Mock).mockReturnValue(accessTokenPayload)

      const result = await refreshTokens('accessTokenUsedAsRefresh')

      expect(result).toBeNull()
    })

    it('should return null when token has no type property', async () => {
      const tokenWithoutType = { ...mockPayload }
      delete tokenWithoutType.type
      ;(jwt.verify as jest.Mock).mockReturnValue(tokenWithoutType)

      const result = await refreshTokens('tokenWithoutType')

      expect(result).toBeNull()
    })

    it('should return null when expired refresh token is provided', async () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date())
      })

      const result = await refreshTokens('expiredRefreshToken')

      expect(result).toBeNull()
    })

    it('should generate new tokens with clean payload (no type field)', async () => {
      const newTokens = { token: 'newAccessToken', refreshToken: 'newRefreshToken' }

      ;(jwt.verify as jest.Mock).mockReturnValue(mockRefreshPayload)
      ;(rotateUserSessionAndTokens as jest.Mock).mockResolvedValue(newTokens)

      const result = await refreshTokens('validRefreshToken')

      expect(rotateUserSessionAndTokens).toHaveBeenCalledWith(mockRefreshPayload)
      expect(result).toEqual(newTokens)
    })
  })
})
