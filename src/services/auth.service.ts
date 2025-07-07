import { ObjectId } from 'mongodb'
import { parameters } from '../config/parameters'
import { verifyHashedString } from '../helpers/crypto.helper'
import { invalidateSession, isActiveSession, rotateUserSessionAndTokens } from '../helpers/session.helper'
import { Payload } from '../interfaces/payload.interface'
import { AuthServiceLoginResponse } from '../types/index.types'
import { AttemptsEnum } from '../utils/enums/attempts.enum'
import { BlockReasonEnum } from '../utils/enums/blocks.enum'
import { refreshTokens, verifyToken } from '../utils/jwt.utils'
import attemptService from './attempt.service'
import blockService from './block.service'
import sessionService from './session.service'
import userService from './user.service'

const { maxLoginAttempts } = parameters
const maxLoginAttemptsDuration = parameters.blockDuration

class AuthService {
  async login(email: string, password: string): Promise<AuthServiceLoginResponse | null> {
    const user = await userService.findByEmail(email)
    if (!user) return null

    const areMaxAttemptsReached = await attemptService.isMaxLoginAttemptsReached(user.id, maxLoginAttempts)
    if (areMaxAttemptsReached) {
      await blockService.setBlock(
        user.id,
        AttemptsEnum.LOGIN,
        Date.now() + maxLoginAttemptsDuration,
        BlockReasonEnum.MAX_ATTEMPTS,
      )

      return null
    }

    const isValidPassword = verifyHashedString(password, user.password)
    if (!isValidPassword) {
      await attemptService.create({
        userId: new ObjectId(user.id),
        type: AttemptsEnum.LOGIN,
        success: false,
        email: user.email,
      })

      return null
    }

    const payload: Payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      idDocument: user.idDocument,
    }
    const { token, refreshToken } = await rotateUserSessionAndTokens(payload)

    await attemptService.deleteByUserAndType(user.id, AttemptsEnum.LOGIN, false)
    await blockService.removeBlocks(user.id, AttemptsEnum.LOGIN)

    return { user, token, refreshToken }
  }

  async info(token: string): Promise<Payload | null> {
    return verifyToken(token)
  }

  async refreshTokens(token: string): Promise<{ token: string; refreshToken: string } | null> {
    const isActiveToken = await isActiveSession(token)
    if (!isActiveToken) return null

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
