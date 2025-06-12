import jwt from 'jsonwebtoken'
import { Payload } from '../interfaces/payload.interface'
import { parameters } from '../config/parameters'
import logger from './logger'

const { jwtSecret, jwtExpiration, jwtRefreshExpiration } = parameters

function generateToken(payload: Payload): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration })
}

function generateRefreshToken(payload: Payload): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtRefreshExpiration })
}

function generateAccessTokens(payload: Payload): { token: string; refreshToken: string } {
  const token = generateToken(payload)
  const refreshToken = generateRefreshToken(payload)
  return {
    token,
    refreshToken,
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

export { generateToken, generateRefreshToken, generateAccessTokens, verifyToken }
