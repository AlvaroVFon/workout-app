import { verifyHashedString } from '../helpers/crypto.helper'
import { invalidateSession, rotateUserSessionAndTokens } from '../helpers/session.helper'
import { Payload } from '../interfaces/payload.interface'
import { AuthServiceLoginResponse } from '../types/index.types'
import { refreshTokens, verifyToken } from '../utils/jwt.utils'
import sessionService from './session.service'
import userService from './user.service'

class AuthService {
  async login(email: string, password: string): Promise<AuthServiceLoginResponse | null> {
    const user = await userService.findByEmail(email)

    if (!user) return null

    const isValidPassword = verifyHashedString(password, user.password)

    if (!isValidPassword) return null

    const payload: Payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      idDocument: user.idDocument,
    }

    const { token, refreshToken } = await rotateUserSessionAndTokens(payload)

    return { user, token, refreshToken }
  }

  async info(token: string): Promise<Payload | null> {
    return verifyToken(token)
  }

  async refreshTokens(token: string): Promise<{ token: string; refreshToken: string } | null> {
    return refreshTokens(token)
  }

  async logout(token: string): Promise<boolean> {
    const payload = verifyToken(token)
    if (!payload) return false

    const session = await sessionService.findActiveByUserId(payload.id)
    if (!session) return false

    await invalidateSession(session)
    return true
  }
}

export default new AuthService()
