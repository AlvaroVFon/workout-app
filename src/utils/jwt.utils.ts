import jwt from 'jsonwebtoken'
import { parameters } from '../config/parameters'
import { Payload } from '../interfaces/payload.interface'
import { UserDTO } from '../DTOs/user/user.dto'
import logger from './logger'
import { rotateUserSessionAndTokens } from '../helpers/session.helper'
import { TokenTypeEnum } from './enums/token.enum'

const { jwtSecret, jwtExpiration, jwtRefreshExpiration, jwtResetPasswordExpiration } = parameters

function generateToken(payload: Payload): string {
  const tokenPayload = { ...payload, type: 'access' }
  return jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiration })
}

function generateRefreshToken(payload: Payload): string {
  const refreshPayload = { ...payload, type: 'refresh' }
  return jwt.sign(refreshPayload, jwtSecret, { expiresIn: jwtRefreshExpiration })
}

function generateResetPasswordToken(payload: Payload): string {
  const resetPayload = { id: payload.id, type: 'resetPassword' }
  return jwt.sign(resetPayload, jwtSecret, { expiresIn: jwtResetPasswordExpiration })
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

async function refreshTokens(refreshToken: string): Promise<{ token: string; refreshToken: string } | null> {
  const payload = verifyRefreshToken(refreshToken)

  if (!payload) return null

  const { token, refreshToken: newRefreshToken } = await rotateUserSessionAndTokens(payload)

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

function buildPayload(user: UserDTO, type?: TokenTypeEnum): Payload {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    idDocument: user.idDocument,
    type,
  }
}

export {
  generateAccessTokens,
  generateRefreshToken,
  generateToken,
  generateResetPasswordToken,
  refreshTokens,
  verifyRefreshToken,
  verifyToken,
  buildPayload,
}
