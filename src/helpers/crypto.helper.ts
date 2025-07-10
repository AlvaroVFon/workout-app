import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { parameters } from '../config/parameters'

const saltRounds = parameters.saltRounds

type hashAlgorithm = 'bcrypt' | 'sha256'

async function hashString(string: string, algorithm: hashAlgorithm = 'bcrypt'): Promise<string> {
  if (algorithm === 'bcrypt') {
    const salt = await bcrypt.genSalt(saltRounds)
    return bcrypt.hash(string, salt)
  }

  if (algorithm === 'sha256') {
    return crypto.createHash('sha256').update(string).digest('hex')
  }

  throw new Error(`Unsupported hash algorithm: ${algorithm}`)
}

function verifyHashedString(string: string, hashedString: string, algorithm: hashAlgorithm = 'bcrypt'): boolean {
  if (algorithm === 'bcrypt') {
    return bcrypt.compareSync(string, hashedString)
  } else if (algorithm === 'sha256') {
    const hash = crypto.createHash('sha256').update(string).digest('hex')
    return hash === hashedString
  }
  throw new Error('Unsupported algorithm')
}

function generateUUID(): string {
  return crypto.randomUUID()
}

export { hashString, verifyHashedString, generateUUID }
