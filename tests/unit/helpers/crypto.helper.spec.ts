import bcrypt from 'bcrypt'
import { hashString, verifyHashedString } from '../../../src/helpers/crypto.helper'
import crypto from 'node:crypto'
import { parameters } from '../../../src/config/parameters'

jest.mock('bcrypt')
jest.mock('node:crypto')

describe('Password Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hashString', () => {
    it('should hash the password using bcrypt', async () => {
      const password = 'testPassword'
      const salt = 'testSalt'
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.genSalt as jest.Mock).mockResolvedValue(salt)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

      const result = await hashString(password)

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt)
      expect(result).toBe(hashedPassword)
    })

    it('should throw an error if bcrypt fails to hash the password', async () => {
      const password = 'testPassword'
      const errorMessage = 'Hashing failed'

      ;(bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(hashString(password)).rejects.toThrow(errorMessage)
    })

    it('should hash the password using sha256', async () => {
      const password = 'testPassword'
      const hashedPassword = 'hashedTestPassword'

      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(hashedPassword),
      } as any)

      const result = await hashString(password, 'sha256')

      expect(crypto.createHash).toHaveBeenCalledWith('sha256')
      expect(result).toBe(hashedPassword)
    })

    it('should hash the password using bcrypt with custom salt rounds', async () => {
      const password = 'testPassword'
      const salt = 'testSalt'
      const hashedPassword = 'hashedTestPassword'
      ;(bcrypt.genSalt as jest.Mock).mockResolvedValue(salt)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

      const result = await hashString(password)
      expect(bcrypt.genSalt).toHaveBeenCalledWith(parameters.saltRounds)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt)
      expect(result).toBe(hashedPassword)
    })

    it('should handle empty strings gracefully', async () => {
      const password = ''
      const hashedPassword = 'hashedEmptyPassword'

      ;(bcrypt.genSalt as jest.Mock).mockResolvedValue('testSalt')
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

      const result = await hashString(password)

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'testSalt')
      expect(result).toBe(hashedPassword)
    })

    it('should throw an error if an unsupported algorithm is used', async () => {
      const password = 'testPassword'

      await expect(hashString(password, 'unsupported' as any)).rejects.toThrow(
        'Unsupported hash algorithm: unsupported',
      )
    })
  })

  describe('verifyHashedString', () => {
    it('should return true when password matches hashed password', () => {
      const password = 'testPassword'
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

      const result = verifyHashedString(password, hashedPassword)

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('should return false when password does not match hashed password', () => {
      const password = 'wrongPassword'
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = verifyHashedString(password, hashedPassword)

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(false)
    })

    it('should handle empty strings gracefully', () => {
      const password = ''
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

      const result = verifyHashedString(password, hashedPassword)

      expect(result).toBe(false)
    })

    it('should handle special characters in password', () => {
      const password = 'p@ssw0rd!#$%'
      const hashedPassword = 'hashedSpecialPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

      const result = verifyHashedString(password, hashedPassword)

      expect(result).toBe(true)
    })

    it('should throw an error if an unsupported algorithm is used', () => {
      const password = 'testPassword'
      const hashedPassword = 'hashedTestPassword'

      expect(() => verifyHashedString(password, hashedPassword, 'unsupported' as any)).toThrow('Unsupported algorithm')
    })

    it('should use bcrypt as algorithm', () => {
      const password = 'testPassword'
      const hashedPassword = 'hashedTestPassword'

      ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

      const result = verifyHashedString(password, hashedPassword, 'bcrypt')

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('should use sha256 as algorithm', () => {
      const password = 'testPassword'
      const hashedPassword = 'hashedTestPassword'

      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(hashedPassword),
      } as any)

      const result = verifyHashedString(password, hashedPassword, 'sha256')

      expect(crypto.createHash).toHaveBeenCalledWith('sha256')
      expect(result).toBe(true)
    })
  })

  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      jest.spyOn(global.crypto, 'randomUUID').mockReturnValue(uuid)

      const result = global.crypto.randomUUID()

      expect(result).toBe(uuid)
    })

    it('should throw an error if UUID generation fails', () => {
      jest.spyOn(global.crypto, 'randomUUID').mockImplementation(() => {
        throw new Error('UUID generation failed')
      })

      expect(() => global.crypto.randomUUID()).toThrow('UUID generation failed')
    })
  })
})
