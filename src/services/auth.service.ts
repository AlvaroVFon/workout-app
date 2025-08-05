import { ObjectId } from 'mongodb'
import { parameters } from '../config/parameters'
import NotFoundException from '../exceptions/NotFoundException'
import TooManyRequestException from '../exceptions/TooManyRequestException'
import { createSignupData, handleMaxAttempts } from '../helpers/auth.helper'
import { verifyHashedString } from '../helpers/crypto.helper'
import { invalidateSession, isActiveSession, rotateUserSessionAndTokens } from '../helpers/session.helper'
import { Payload } from '../interfaces/payload.interface'
import type { AuthServiceLoginResponse, SignupCredentials } from '../types/index.types'
import { AttemptsEnum } from '../utils/enums/attempts.enum'
import { CodeType } from '../utils/enums/code.enum'
import { RolesEnum } from '../utils/enums/roles.enum'
import { TokenTypeEnum } from '../utils/enums/token.enum'
import { buildPayload, generateResetPasswordToken, refreshTokens, verifyToken } from '../utils/jwt.utils'
import attemptService from './attempt.service'
import blockService from './block.service'
import cacheService from './cache.service'
import codeService from './code.service'
import mailService from './mail.service'
import sessionService from './session.service'
import userService from './user.service'

const { maxLoginAttempts, maxSignupAttempts } = parameters

class AuthService {
  async signup(email: string, password: string): Promise<void> {
    const { id, signupCredentials } = await createSignupData(email, password)
    const isValidLastCodeInterval = await codeService.verifyLastCodeInterval(id, CodeType.SIGNUP)

    if (!isValidLastCodeInterval) {
      throw new TooManyRequestException('Please wait before requesting a new code')
    }

    const code = await codeService.create(id, CodeType.SIGNUP)

    await cacheService.set(`signup: ${id}`, signupCredentials)
    await mailService.sendSignupEmail(email, code.code, id)
  }

  async signupVerification(uuid: string, code: string): Promise<boolean> {
    const cachedData = await cacheService.get<SignupCredentials>(`signup: ${uuid}`)
    if (!cachedData) return false

    const isMaxAttemptsReached = await handleMaxAttempts(cachedData.id, maxSignupAttempts, AttemptsEnum.SIGNUP)
    if (isMaxAttemptsReached) return false

    const isValidCode = await codeService.isCodeValid(code, uuid, CodeType.SIGNUP)
    const isValidLastCodeInterval = await codeService.verifyLastCodeInterval(cachedData.id, CodeType.SIGNUP)

    if (!isValidCode || !isValidLastCodeInterval) {
      await attemptService.create({
        userId: new ObjectId(cachedData.id),
        type: AttemptsEnum.SIGNUP_VERIFY,
        success: false,
        email: cachedData?.email,
      })
      return false
    }

    await attemptService.deleteByUserAndType(cachedData.id, AttemptsEnum.SIGNUP_VERIFY, false)
    await blockService.removeBlocks(cachedData.id, AttemptsEnum.SIGNUP_VERIFY)

    await userService.create({
      email: cachedData.email,
      password: cachedData.password,
      role: RolesEnum.USER,
    })

    mailService.sendSignupSucceedEmail(cachedData.email)

    return true
  }

  async login(email: string, password: string): Promise<AuthServiceLoginResponse | null> {
    const user = await userService.findByEmail(email)
    if (!user) return null

    const isMaxAttemptsReached = await handleMaxAttempts(user.id, maxLoginAttempts, AttemptsEnum.LOGIN)
    if (isMaxAttemptsReached) return null

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

    const payload = buildPayload(user)
    const { token, refreshToken } = await rotateUserSessionAndTokens(payload)

    await attemptService.deleteByUserAndType(user.id, AttemptsEnum.LOGIN, false)
    await blockService.removeBlocks(user.id, AttemptsEnum.LOGIN)

    return { user, token, refreshToken }
  }

  async info(token: string): Promise<Payload | null> {
    return verifyToken(token, TokenTypeEnum.ACCESS)
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await userService.findByEmail(email)
    if (!user) return false

    const isMaxAttemptsReached = await handleMaxAttempts(user.id, maxLoginAttempts, AttemptsEnum.PASSWORD_RECOVERY)
    const isValidLastCodeInterval = await codeService.verifyLastCodeInterval(user.id, CodeType.RECOVERY)

    if (isMaxAttemptsReached) {
      throw new TooManyRequestException('Please wait before requesting a new code')
    }

    if (!isValidLastCodeInterval) {
      await attemptService.create({
        userId: new ObjectId(user.id),
        type: AttemptsEnum.PASSWORD_RECOVERY,
        success: false,
        email: user.email,
      })
      throw new TooManyRequestException('Please wait before requesting a new code')
    }

    const code = await codeService.create(user.id, CodeType.RECOVERY)
    const payload: Payload = buildPayload(user)

    const resetPasswordToken = generateResetPasswordToken(payload)
    await mailService.sendPasswordRecoveryEmail(user.email, code.code, resetPasswordToken)

    return true
  }

  async resetPassword(token: string, code: string, password: string): Promise<boolean> {
    const payload = verifyToken(token, TokenTypeEnum.RESET_PASSWORD)
    if (!payload) return false

    const isMaxAttemptsReached = await handleMaxAttempts(payload.id, maxLoginAttempts, AttemptsEnum.PASSWORD_CHANGE)
    if (isMaxAttemptsReached) return false

    const user = await userService.findById(payload?.id)
    if (!user) return false

    const isCodeValid = await codeService.isCodeValid(code, user.id, CodeType.RECOVERY)

    if (!isCodeValid) {
      await attemptService.create({
        userId: new ObjectId(user.id),
        type: AttemptsEnum.PASSWORD_CHANGE,
        success: false,
        email: user.email,
      })

      throw new NotFoundException('Invalid or expired code')
    }

    await codeService.invalidateCode(code, user.id)
    await userService.update(user.id, { password })
    await mailService.sendResetPasswordOkEmail(user.email)

    return true
  }

  async refreshTokens(token: string): Promise<{ token: string; refreshToken: string } | null> {
    const isActiveToken = await isActiveSession(token)
    if (!isActiveToken) return null

    return refreshTokens(token)
  }

  async logout(token: string): Promise<boolean> {
    const payload = verifyToken(token, TokenTypeEnum.REFRESH)
    if (!payload) return false

    const session = await sessionService.findActiveByUserId(payload.id)
    if (!session) return false

    await invalidateSession(session)
    return true
  }
}

export default new AuthService()
