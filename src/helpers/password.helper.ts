import bcrypt from 'bcrypt'

const saltRounds = 10

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}

export { hashPassword, verifyPassword }
