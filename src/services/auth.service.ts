import { generateAccessTokens, verifyToken } from '../utils/jwt.utils'
import bcrypt from 'bcrypt'
import userService from './user.service'
import { Payload } from '../interfaces/payload.interface'

class AuthService {
  async login(email: string, password: string): Promise<{ token: string; refreshToken: string } | false> {
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

    return generateAccessTokens(payload)
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword)
  }

  async info(token: string): Promise<Payload | null> {
    return verifyToken(token)
  }
}

export default new AuthService()
