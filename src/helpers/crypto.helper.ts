import bcrypt from 'bcrypt'
import { parameters } from '../config/parameters'

const saltRounds = parameters.saltRounds

async function hashString(string: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(string, salt)
}

function verifyHashedString(string: string, hashedString: string): boolean {
  return bcrypt.compareSync(string, hashedString)
}

export { hashString, verifyHashedString }
