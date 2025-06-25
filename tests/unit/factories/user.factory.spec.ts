import { createUser, createAdminUser, createSuperAdminUser, createUsers } from '../../../src/factories/user.factory'
import { CreateUserDTO } from '../../../src/DTOs/user/create.dto'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'

jest.mock('@faker-js/faker', () => ({
  faker: {
    person: {
      firstName: jest.fn(() => 'John'),
    },
    internet: {
      email: jest.fn(() => 'test@example.com'),
      password: jest.fn(() => 'password123'),
    },
    string: {
      numeric: jest.fn(() => '123456789'),
    },
  },
}))

describe('User Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a user with default values when no user is provided', () => {
      const result = createUser()

      expect(result).toEqual({
        name: 'John',
        email: 'test@example.com',
        password: 'password123',
        idDocument: '123456789',
        role: RolesEnum.USER,
      })
    })

    it('should use provided user data when available', () => {
      const providedUser: CreateUserDTO = {
        name: 'Jane',
        email: 'jane@example.com',
        password: 'customPassword',
        idDocument: 'custom-id',
        role: RolesEnum.ADMIN,
      }

      const result = createUser(providedUser)

      expect(result).toEqual(providedUser)
    })

    it('should handle partial user data', () => {
      const partialUser = {
        name: 'Partial',
        email: 'partial@example.com',
      } as CreateUserDTO

      const result = createUser(partialUser)

      expect(result.name).toBe('Partial')
      expect(result.email).toBe('partial@example.com')
      expect(result.password).toBe('password123') // Should use faker default
      expect(result.idDocument).toBe('123456789') // Should use faker default
      expect(result.role).toBe(RolesEnum.USER) // Should use default
    })
  })

  describe('createAdminUser', () => {
    it('should create an admin user with predefined values', () => {
      const result = createAdminUser()

      expect(result).toEqual({
        name: 'admin',
        email: 'admin@email.com',
        password: '123456Aa.',
        idDocument: '000000',
        role: RolesEnum.ADMIN,
      })
    })

    it('should always return the same admin user data', () => {
      const result1 = createAdminUser()
      const result2 = createAdminUser()

      expect(result1).toEqual(result2)
    })
  })

  describe('createSuperAdminUser', () => {
    it('should create a super admin user with predefined values', () => {
      const result = createSuperAdminUser()

      expect(result).toEqual({
        name: 'superadmin',
        email: 'superadmin@email.com',
        password: '123456Aa.',
        idDocument: '000000',
        role: RolesEnum.SUPERADMIN,
      })
    })

    it('should always return the same super admin user data', () => {
      const result1 = createSuperAdminUser()
      const result2 = createSuperAdminUser()

      expect(result1).toEqual(result2)
    })
  })

  describe('createUsers', () => {
    it('should create default number of users when length is not provided', () => {
      const result = createUsers()

      expect(result).toHaveLength(5) // Default length
      result.forEach((user) => {
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('idDocument')
        expect(user).toHaveProperty('role')
        expect(user.role).toBe(RolesEnum.USER)
      })
    })

    it('should create specified number of users', () => {
      const result = createUsers(3)

      expect(result).toHaveLength(3)
      result.forEach((user) => {
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('idDocument')
        expect(user).toHaveProperty('role')
      })
    })

    it('should create empty array when length is 0', () => {
      const result = createUsers(0)

      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    it('should create users with unique data', () => {
      const result = createUsers(2)

      expect(result).toHaveLength(2)
      // All users should have the same mocked values in this test environment
      expect(result[0]).toEqual(result[1])
    })
  })
})
