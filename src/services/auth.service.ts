import { verifyHashedString } from '../helpers/crypto.helper'
import { rotateUserSessionAndTokens } from '../helpers/session.helper'
import { Payload } from '../interfaces/payload.interface'
import { AuthServiceLoginResponse } from '../types/index.types'
import { refreshTokens, verifyToken } from '../utils/jwt.utils'
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
}

export default new AuthService()
