import { Response } from 'express'
import { parameters } from '../config/parameters'
import attemptService from '../services/attempt.service'
import blockService from '../services/block.service'
import { AttemptsEnum } from '../utils/enums/attempts.enum'
import { BlockReasonEnum } from '../utils/enums/blocks.enum'
import { generateUUID, hashString } from './crypto.helper'

const { blockDuration } = parameters

async function createSignupData(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required for signup.')
  }

  const id = generateUUID()
  const hashedPassword = await hashString(password, 'bcrypt')

  const signupCredentials = {
    email,
    password: hashedPassword,
  }

  return {
    id,
    signupCredentials,
  }
}

async function handleMaxAttempts(id: string, maxAttempts: number, type: AttemptsEnum) {
  const areMaxAttemptsReached = await attemptService.isMaxLoginAttemptsReached(id, maxAttempts, type)

  if (areMaxAttemptsReached) {
    await blockService.setBlock(id, type, Date.now() + blockDuration, BlockReasonEnum.MAX_ATTEMPTS)
    return true
  }
  return false
}

async function handleHttpCookie(name: string, value: string, expiration: number, res: Response) {
  return res.cookie(name, value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: parameters.nodeEnv === 'production',
    maxAge: expiration,
  })
}

export { createSignupData, handleHttpCookie, handleMaxAttempts }
