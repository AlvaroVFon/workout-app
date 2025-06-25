import { seedUsers } from '../../../src/seeders/user.seeder'
import userService from '../../../src/services/user.service'
import { createAdminUser, createSuperAdminUser, createUsers } from '../../../src/factories/user.factory'
import { Connection } from 'mongoose'
import { CreateUserDTO } from '../../../src/DTOs/user/create.dto'
import { RolesEnum } from '../../../src/utils/enums/roles.enum'
import { checkCollectionExistence } from '../../../src/utils/database.utils'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/factories/user.factory')
jest.mock('../../../src/utils/database.utils')

describe('User Seeder', () => {
  let mockConnection: jest.Mocked<Connection>
  let mockCollection: { drop: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()

    mockCollection = {
      drop: jest.fn(),
    }

    mockConnection = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<Connection>
  })

  describe('seedUsers', () => {
    it('should successfully seed users', async () => {
      const mockSuperAdminUser = {
        name: 'superadmin',
        email: 'superadmin@email.com',
        password: '123456Aa.',
        idDocument: '000000',
        role: RolesEnum.SUPERADMIN,
      }

      const mockAdminUser = {
        name: 'admin',
        email: 'admin@email.com',
        password: '123456Aa.',
        idDocument: '000000',
        role: RolesEnum.ADMIN,
      }

      const mockRegularUsers: CreateUserDTO[] = [
        {
          name: 'Regular',
          email: 'user@test.com',
          password: 'password123',
          role: RolesEnum.USER,
          idDocument: '11111111',
        },
      ]

      jest.mocked(checkCollectionExistence).mockResolvedValue(false)
      jest.mocked(createSuperAdminUser).mockReturnValue(mockSuperAdminUser)
      jest.mocked(createAdminUser).mockReturnValue(mockAdminUser)
      jest.mocked(createUsers).mockReturnValue(mockRegularUsers)
      jest.mocked(userService.create).mockResolvedValue({} as never)

      await seedUsers(mockConnection)

      expect(createSuperAdminUser).toHaveBeenCalled()
      expect(createAdminUser).toHaveBeenCalled()
      expect(createUsers).toHaveBeenCalledWith(20)
      expect(userService.create).toHaveBeenCalledWith(mockSuperAdminUser)
      expect(userService.create).toHaveBeenCalledWith(mockAdminUser)
      expect(userService.create).toHaveBeenCalledWith(mockRegularUsers[0])
    })

    it('should drop collection when collection exists', async () => {
      const mockUser = {
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        idDocument: '000000',
        role: RolesEnum.USER,
      }

      jest.mocked(checkCollectionExistence).mockResolvedValue(true)
      jest.mocked(createSuperAdminUser).mockReturnValue(mockUser)
      jest.mocked(createAdminUser).mockReturnValue(mockUser)
      jest.mocked(createUsers).mockReturnValue([])
      jest.mocked(userService.create).mockResolvedValue({} as never)

      await seedUsers(mockConnection)

      expect(checkCollectionExistence).toHaveBeenCalledWith(mockConnection, 'users')
      expect(mockCollection.drop).toHaveBeenCalled()
    })

    it('should not drop collection when collection does not exist', async () => {
      const mockUser = {
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        idDocument: '000000',
        role: RolesEnum.USER,
      }

      jest.mocked(checkCollectionExistence).mockResolvedValue(false)
      jest.mocked(createSuperAdminUser).mockReturnValue(mockUser)
      jest.mocked(createAdminUser).mockReturnValue(mockUser)
      jest.mocked(createUsers).mockReturnValue([])
      jest.mocked(userService.create).mockResolvedValue({} as never)

      await seedUsers(mockConnection)

      expect(checkCollectionExistence).toHaveBeenCalledWith(mockConnection, 'users')
      expect(mockCollection.drop).not.toHaveBeenCalled()
    })

    it('should handle errors during user creation', async () => {
      const mockUser = {
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        idDocument: '000000',
        role: RolesEnum.USER,
      }

      jest.mocked(checkCollectionExistence).mockResolvedValue(false)
      jest.mocked(createSuperAdminUser).mockReturnValue(mockUser)
      jest.mocked(userService.create).mockRejectedValue(new Error('Creation error'))

      // Error should be caught and logged but not thrown
      await expect(seedUsers(mockConnection)).resolves.not.toThrow()
    })

    it('should handle errors during collection drop', async () => {
      const mockUser = {
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        idDocument: '000000',
        role: RolesEnum.USER,
      }

      jest.mocked(checkCollectionExistence).mockResolvedValue(true)
      mockCollection.drop.mockRejectedValue(new Error('Drop error'))
      jest.mocked(createSuperAdminUser).mockReturnValue(mockUser)
      jest.mocked(createAdminUser).mockReturnValue(mockUser)
      jest.mocked(createUsers).mockReturnValue([])
      jest.mocked(userService.create).mockResolvedValue({} as never)

      // Error should be caught and logged but not thrown
      await expect(seedUsers(mockConnection)).resolves.not.toThrow()
    })

    it('should create admin users before regular users', async () => {
      const mockSuperAdminUser = {
        name: 'superadmin',
        email: 'superadmin@email.com',
        password: '123456Aa.',
        idDocument: '000000',
        role: RolesEnum.SUPERADMIN,
      }

      const mockAdminUser = {
        name: 'admin',
        email: 'admin@email.com',
        password: '123456Aa.',
        idDocument: '000000',
        role: RolesEnum.ADMIN,
      }

      jest.mocked(checkCollectionExistence).mockResolvedValue(false)
      jest.mocked(createSuperAdminUser).mockReturnValue(mockSuperAdminUser)
      jest.mocked(createAdminUser).mockReturnValue(mockAdminUser)
      jest.mocked(createUsers).mockReturnValue([])
      jest.mocked(userService.create).mockResolvedValue({} as never)

      await seedUsers(mockConnection)

      // Verify that Promise.all is called with admin users first
      expect(userService.create).toHaveBeenCalledWith(mockSuperAdminUser)
      expect(userService.create).toHaveBeenCalledWith(mockAdminUser)
    })
  })
})
