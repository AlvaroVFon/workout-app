import jwt from 'jsonwebtoken'
import { parameters } from '../config/parameters'
import { Payload } from '../interfaces/payload.interface'
import { UserDTO } from '../DTOs/user/user.dto'
import logger from './logger'
import { rotateUserSessionAndTokens } from '../helpers/session.helper'
import { TokenTypeEnum } from './enums/token.enum'

const { jwtSecret, jwtExpiration, jwtRefreshExpiration, jwtResetPasswordExpiration, jwtSignupExpiration } = parameters

function generateToken(payload: Payload): string {
  const tokenPayload = { ...payload, type: TokenTypeEnum.ACCESS }
  return signToken(tokenPayload)
}

function generateRefreshToken(payload: Payload): string {
  const refreshPayload = { ...payload, type: TokenTypeEnum.REFRESH }
  return signToken(refreshPayload, jwtRefreshExpiration)
}

function generateResetPasswordToken(payload: Payload): string {
  const resetPayload = { id: payload.id, type: TokenTypeEnum.RESET_PASSWORD }
  return signToken(resetPayload, jwtResetPasswordExpiration)
}

function generateSingupToken(payload: Payload | Partial<Payload>): string {
  const signedPayload = { ...payload, type: TokenTypeEnum.SIGNUP }
  return signToken(signedPayload, jwtSignupExpiration)
}

function signToken(payload: Payload | Partial<Payload>, expiration: number = jwtExpiration): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: expiration })
}

function generateAccessTokens(payload: Payload): { token: string; refreshToken: string } {
  return {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

function verifyToken(token: string, type: TokenTypeEnum): Payload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret) as Payload
    if (decoded.type !== type) return null

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
  return verifyToken(token, TokenTypeEnum.REFRESH)
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

function buildPartialPayload(user: Partial<UserDTO>, type?: TokenTypeEnum): Partial<Payload> {
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
  generateSingupToken,
  refreshTokens,
  verifyRefreshToken,
  verifyToken,
  buildPayload,
  buildPartialPayload,
}
