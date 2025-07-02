import { verifyPassword } from '../helpers/password.helper'
import { Payload } from '../interfaces/payload.interface'
import { AuthServiceLoginResponse } from '../types/index.types'
import { generateAccessTokens, refreshToken as refreshTokenUtil, verifyToken } from '../utils/jwt.utils'
import userService from './user.service'

class AuthService {
  async login(email: string, password: string): Promise<AuthServiceLoginResponse | null> {
    const user = await userService.findByEmail(email)

    if (!user) return null

    const isValidPassword = verifyPassword(password, user.password)

    if (!isValidPassword) return null

    const payload: Payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      idDocument: user.idDocument,
    }

    const { token, refreshToken } = generateAccessTokens(payload)
    return { user, token, refreshToken }
  }

  async info(token: string): Promise<Payload | null> {
    return verifyToken(token)
  }

  async refreshToken(token: string): Promise<{ token: string; refreshToken: string } | null> {
    return refreshTokenUtil(token)
  }
}

export default new AuthService()
