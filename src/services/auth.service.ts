import bcrypt from 'bcrypt'
import { Payload } from '../interfaces/payload.interface'
import { AuthServiceLoginResponse } from '../types/index.types'
import { generateAccessTokens, verifyToken } from '../utils/jwt.utils'
import userService from './user.service'

class AuthService {
  async login(email: string, password: string): Promise<AuthServiceLoginResponse | false> {
    const user = await userService.findByEmail(email)

    if (!user) return false

    const isValidPassword = this.verifyPassword(password, user.password)

    if (!isValidPassword) return false

    const payload: Payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      idDocument: user.idDocument,
    }

    const { token, refreshToken } = generateAccessTokens(payload)
    return { user, token, refreshToken }
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword)
  }

  async info(token: string): Promise<Payload | null> {
    return verifyToken(token)
  }
}

export default new AuthService()
