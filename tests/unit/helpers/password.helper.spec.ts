import bcrypt from 'bcrypt'
import { hashPassword, verifyPassword } from '../../../src/helpers/password.helper'

jest.mock('bcrypt')

describe('Password Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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

    it('should throw an error if bcrypt fails to hash the password', async () => {
      const password = 'testPassword'
      const errorMessage = 'Hashing failed'

      ;(bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(hashPassword(password)).rejects.toThrow(errorMessage)
    })
  })

  describe('verifyPassword', () => {
    it('should return true when password matches hashed password', () => {
      const password = 'testPassword'
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

      const result = verifyPassword(password, hashedPassword)

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('should return false when password does not match hashed password', () => {
      const password = 'wrongPassword'
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = verifyPassword(password, hashedPassword)

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(false)
    })

    it('should handle empty strings gracefully', () => {
      const password = ''
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = verifyPassword(password, hashedPassword)

      expect(result).toBe(false)
    })

    it('should handle special characters in password', () => {
      const password = 'p@ssw0rd!#$%'
      const hashedPassword = 'hashedSpecialPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

      const result = verifyPassword(password, hashedPassword)

      expect(result).toBe(true)
    })
  })
})
