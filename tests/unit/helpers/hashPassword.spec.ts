import { hashPassword } from '../../../src/helpers/hashPassword'
import bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('hashPassword', () => {
  it('should hash the password using bcrypt', async () => {
    const password = 'testPassword'
    const salt = 'testSalt'
    const hashedPassword = 'hashedTestPassword'

    ;(bcrypt.genSalt as jest.Mock).mockResolvedValue(salt)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

    const result = await hashPassword(password)

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt)
    expect(result).toBe(hashedPassword)
  })
})
