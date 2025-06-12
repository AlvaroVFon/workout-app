import userService from '../../../src/services/user.service'
import userRepository from '../../../src/repositories/user.repository'
import { hashPassword } from '../../../src/helpers/hashPassword'
import { CreateUserDTO } from '../../../src/DTOs/user/create.dto'
import { UpdateUserDTO } from '../../../src/DTOs/user/update.dto'
import roleService from '../../../src/services/role.service'

jest.mock('../../../src/repositories/user.repository')
jest.mock('../../../src/services/role.service')
jest.mock('../../../src/helpers/hashPassword', () => ({
  hashPassword: jest.fn(),
}))

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should hash the password and create a user', async () => {
      const mockRole = { _id: 'mockedId', name: 'admin' }
      const mockData: CreateUserDTO = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'Test User',
        role: 'admin',
        idDocument: '123456789',
      }

      const hashedPassword = 'hashedPassword'
      const createdUser = { id: '1', ...mockData, password: hashedPassword }
      ;(roleService.findByName as jest.Mock).mockResolvedValue(mockRole)
      ;(hashPassword as jest.Mock).mockResolvedValue(hashedPassword)
      ;(userRepository.create as jest.Mock).mockResolvedValue(createdUser)

      const result = await userService.create(mockData)

      expect(result).toEqual(createdUser)
      expect(roleService.findByName).toHaveBeenCalledWith('admin')
      expect(userRepository.create).toHaveBeenCalledWith({
        ...mockData,
        password: expect.any(String),
        role: mockRole._id,
      })
    })
  })

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1', email: 'test@example.com', name: 'Test User' }]
      ;(userRepository.findAll as jest.Mock).mockResolvedValue(users)

      const result = await userService.getAll()

      expect(userRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(users)
    })
  })

  describe('getById', () => {
    it('should return a user by ID', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User' }
      ;(userRepository.findById as jest.Mock).mockResolvedValue(user)

      const result = await userService.getById('1')

      expect(userRepository.findById).toHaveBeenCalledWith('1')
      expect(result).toEqual(user)
    })
  })

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'test@example.com', name: 'Test User' }
      ;(userRepository.findOneByEmail as jest.Mock).mockResolvedValue(user)

      const result = await userService.getByEmail('test@example.com')

      expect(userRepository.findOneByEmail).toHaveBeenCalledWith('test@example.com')
      expect(result).toEqual(user)
    })
  })

  describe('update', () => {
    it('should hash the password if provided and update the user', async () => {
      const mockData: UpdateUserDTO = {
        name: 'Updated User',
        password: 'newPassword',
      }

      const hashedPassword = 'hashedPassword'
      const updatedUser = { id: '1', ...mockData, password: hashedPassword }
      ;(hashPassword as jest.Mock).mockResolvedValue(hashedPassword)
      ;(userRepository.update as jest.Mock).mockResolvedValue(updatedUser)

      const result = await userService.update('1', mockData)

      expect(result).toEqual(updatedUser)
    })

    it('should update the user without hashing the password if not provided', async () => {
      const mockData: UpdateUserDTO = { name: 'Updated User' }
      const updatedUser = { id: '1', ...mockData }
      ;(userRepository.update as jest.Mock).mockResolvedValue(updatedUser)

      const result = await userService.update('1', mockData)

      expect(hashPassword).not.toHaveBeenCalled()
      expect(userRepository.update).toHaveBeenCalledWith('1', {
        ...mockData,
        updatedAt: expect.any(Number),
      })
      expect(result).toEqual(updatedUser)
    })
  })

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const deletedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }
      ;(userRepository.delete as jest.Mock).mockResolvedValue(deletedUser)

      const result = await userService.delete('1')

      expect(userRepository.delete).toHaveBeenCalledWith('1')
      expect(result).toEqual(deletedUser)
    })
  })
})
