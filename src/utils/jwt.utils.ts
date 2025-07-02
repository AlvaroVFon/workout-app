import jwt from 'jsonwebtoken'
import { parameters } from '../config/parameters'
import { Payload } from '../interfaces/payload.interface'
import logger from './logger'

const { jwtSecret, jwtExpiration, jwtRefreshExpiration } = parameters

function generateToken(payload: Payload): string {
  const tokenPayload = { ...payload, type: 'access' }
  return jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiration })
}

function generateRefreshToken(payload: Payload): string {
  const refreshPayload = { ...payload, type: 'refresh' }
  return jwt.sign(refreshPayload, jwtSecret, { expiresIn: jwtRefreshExpiration })
}

function generateAccessTokens(payload: Payload): { token: string; refreshToken: string } {
  return {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

function verifyToken(token: string): Payload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as Payload
    return decoded
  } catch (error) {
    logger.warn('Token verification failed:', error)
    return null
  }
}

function refreshToken(refreshToken: string): { token: string; refreshToken: string } | null {
  const payload = verifyRefreshToken(refreshToken)

  if (!payload) return null

  const newPayload: Payload = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    idDocument: payload.idDocument,
  }

  const { token, refreshToken: newRefreshToken } = generateAccessTokens(newPayload)

  return {
    token,
    refreshToken: newRefreshToken,
  }
}

function verifyRefreshToken(token: string): Payload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as Payload
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token type')
    }
    return decoded
  } catch (error) {
    logger.warn('Refresh token verification failed:', error)
    return null
  }
}

export { generateAccessTokens, generateRefreshToken, generateToken, refreshToken, verifyRefreshToken, verifyToken }
