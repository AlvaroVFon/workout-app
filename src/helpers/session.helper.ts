import ms from 'ms'
import { parameters } from '../config/parameters'
import { SessionDTO } from '../DTOs/session/session.dto'
import { hashString } from '../helpers/crypto.helper'
import type { Payload } from '../interfaces/payload.interface'
import sessionService from '../services/session.service'
import { generateAccessTokens } from '../utils/jwt.utils'

const jwtRefreshExpiration = Number(ms(parameters.jwtRefreshExpiration))

function invalidateSession(session: SessionDTO, newSession?: SessionDTO) {
  return sessionService.update(session._id.toString(), { isActive: false, replacedBy: newSession?._id })
}

function rotateSession(oldSession: SessionDTO, newSession: SessionDTO) {
  return sessionService.update(oldSession._id.toString(), {
    isActive: false,
    replacedBy: newSession._id,
    expiresAt: Date.now(),
  })
}

async function rotateUserSessionAndTokens(payload: Payload) {
  const newPayload: Payload = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    idDocument: payload.idDocument,
  }

  const { token, refreshToken: newRefreshToken } = generateAccessTokens(newPayload)
  const oldSession = await sessionService.findActiveByUserId(payload.id)

  const newSession = await sessionService.create({
    userId: payload.id,
    isActive: true,
    expiresAt: Date.now() + jwtRefreshExpiration,
    refreshTokenHash: await hashString(newRefreshToken, 'sha256'),
  })

  if (oldSession) await rotateSession(oldSession, newSession)

  return { token, refreshToken: newRefreshToken }
}

async function isActiveSession(token: string): Promise<boolean> {
  const hashedToken = await hashString(token, 'sha256')
  const session = await sessionService.findByRefreshTokenHash(hashedToken)

  return session?.isActive ?? false
}

export { invalidateSession, isActiveSession, rotateSession, rotateUserSessionAndTokens }
