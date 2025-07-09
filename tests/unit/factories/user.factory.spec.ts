import { createUser, createAdminUser, createSuperAdminUser, createUsers } from '../../../src/factories/user.factory'
import { CreateUserDTO } from '../../../src/DTOs/user/create.dto'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'
import { hashString } from '../../../src/helpers/crypto.helper'

jest.mock('../../../src/helpers/crypto.helper')

jest.mock('@faker-js/faker', () => ({
  faker: {
    person: {
      firstName: jest.fn(() => 'John'),
      lastName: jest.fn(() => 'Doe'),
    },
    internet: {
      email: jest.fn(() => 'test@example.com'),
      password: jest.fn(() => 'password123'),
    },
    string: {
      numeric: jest.fn(() => '123456789'),
    },
    location: {
      country: jest.fn(() => 'Testland'),
    },
  },
}))

describe('User Factory', () => {
  beforeAll(() => {
    ;(hashString as jest.Mock).mockResolvedValue('hashedPassword')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a user with default values when no user is provided', async () => {
      const result = await createUser()

      expect(result).toEqual({
        name: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
        idDocument: '123456789',
        role: RolesEnum.USER,
        country: 'Testland',
      })
    })

    it('should use provided user data when available', async () => {
      const providedUser: CreateUserDTO = {
        name: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'hashedPassword',
        idDocument: 'custom-id',
        role: RolesEnum.ADMIN,
        country: 'Testland',
      }

      const result = await createUser(providedUser)

      expect(result).toEqual(providedUser)
    })

    it('should handle partial user data', async () => {
      const partialUser = {
        name: 'Partial',
        email: 'partial@example.com',
      } as CreateUserDTO

      const result = await createUser(partialUser)

      expect(result.name).toBe('Partial')
      expect(result.email).toBe('partial@example.com')
      expect(result.password).toBe('hashedPassword')
      expect(result.idDocument).toBe('123456789')
      expect(result.role).toBe(RolesEnum.USER)
    })
  })

  describe('createAdminUser', () => {
    it('should create an admin user with predefined values', async () => {
      const result = await createAdminUser()

      expect(result).toEqual({
        name: 'admin',
        lastName: 'admin',
        email: 'admin@email.com',
        password: 'hashedPassword',
        idDocument: '000000',
        role: RolesEnum.ADMIN,
        country: 'Spain',
        address: 'Calle de la Admin, 123',
      })
    })

    it('should always return the same admin user data', async () => {
      const result1 = await createAdminUser()
      const result2 = await createAdminUser()

      expect(result1).toEqual(result2)
    })
  })

  describe('createSuperAdminUser', () => {
    it('should create a super admin user with predefined values', async () => {
      const result = await createSuperAdminUser()

      expect(result).toEqual({
        name: 'superadmin',
        lastName: 'superadmin',
        email: 'superadmin@email.com',
        password: 'hashedPassword',
        idDocument: '000000',
        role: RolesEnum.SUPERADMIN,
        country: 'Spain',
        address: 'Calle del Superadmin, 456',
      })
    })

    it('should always return the same super admin user data', async () => {
      const result1 = await createSuperAdminUser()
      const result2 = await createSuperAdminUser()

      expect(result1).toEqual(result2)
    })
  })

  describe('createUsers', () => {
    it('should create default number of users when length is not provided', async () => {
      const result = createUsers()
      const users = await Promise.resolve(result)

      expect(users).toHaveLength(5)
      users.forEach((user) => {
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('idDocument')
        expect(user).toHaveProperty('role')
      })
    })

    it('should create specified number of users', async () => {
      const result = createUsers(3)
      const users = await Promise.resolve(result)

      expect(users).toHaveLength(3)
      users.forEach((user) => {
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('idDocument')
        expect(user).toHaveProperty('role')
      })
    })

    it('should create empty array when length is 0', async () => {
      const result = createUsers(0)
      const users = await Promise.resolve(result)

      expect(users).toHaveLength(0)
      expect(users).toEqual([])
    })

    it('should create users with unique data', async () => {
      const result = createUsers(2)
      const users = await Promise.resolve(result)

      expect(users).toHaveLength(2)
      expect(users[0]).toEqual(users[1])
    })
  })
})
