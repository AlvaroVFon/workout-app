import bcrypt from 'bcrypt'

const saltRounds = 10

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}

export { hashPassword }
