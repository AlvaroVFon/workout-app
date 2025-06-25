import userRepository from '../../../src/repositories/user.repository'
import User from '../../../src/models/User'
import { CreateUserDTO } from '../../../src/DTOs/user/create.dto'
import { UpdateUserDTO } from '../../../src/DTOs/user/update.dto'
import roleService from '../../../src/services/role.service'

jest.mock('../../../src/models/User')
jest.mock('../../../src/services/role.service.ts')

describe('UserRepository', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a user', async () => {
    const data: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      idDocument: '1234567890',
      role: 'admin',
    }
    const mockUser = { _id: '1', ...data }
    const mockRole = { _id: '1', name: 'admin' }
    ;(User.create as jest.Mock).mockResolvedValue(mockUser)
    ;(roleService.findById as jest.Mock).mockResolvedValue(mockRole)

    const result = await userRepository.create(data)

    expect(User.create).toHaveBeenCalledWith(data)
    expect(result).toEqual(mockUser)
  })

  it('should find all users', async () => {
    const mockUsers = [{ _id: '1', name: 'John Doe', email: 'john@example.com' }]
    ;(User.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUsers),
    })

    const result = await userRepository.findAll()

    expect(User.find).toHaveBeenCalled()
    expect(result).toEqual(mockUsers)
  })

  it('should find a user by ID', async () => {
    const mockUser = { _id: '1', name: 'John Doe', email: 'john@example.com' }
    ;(User.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUser),
    })

    const result = await userRepository.findById('1')

    expect(User.findOne).toHaveBeenCalledWith({ _id: '1' })
    expect(result).toEqual(mockUser)
  })

  it('should find a user by email', async () => {
    const mockUser = { _id: '1', name: 'John Doe', email: 'john@example.com' }
    ;(User.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    })

    const result = await userRepository.findOneByEmail('john@example.com')

    expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' })
    expect(result).toEqual(mockUser)
  })

  it('should update a user', async () => {
    const data: UpdateUserDTO = { name: 'Jane Doe' }
    const mockUser = { _id: '1', name: 'Jane Doe', email: 'john@example.com' }
    ;(User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    })

    const result = await userRepository.update('1', data)

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith({ _id: '1' }, data, {
      new: true,
    })
    expect(result).toEqual(mockUser)
  })

  it('should delete a user', async () => {
    const mockUser = { _id: '1', name: 'John Doe', email: 'john@example.com' }
    ;(User.findByIdAndDelete as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    })

    const result = await userRepository.delete('1')

    expect(User.findByIdAndDelete).toHaveBeenCalledWith({ _id: '1' })
    expect(result).toEqual(mockUser)
  })

  it('should get total count with custom query', async () => {
    ;(User.countDocuments as jest.Mock).mockResolvedValue(5)

    const result = await userRepository.getTotal({ role: 'admin' })

    expect(User.countDocuments).toHaveBeenCalledWith({ role: 'admin' })
    expect(result).toBe(5)
  })

  it('should get total count with default empty query', async () => {
    ;(User.countDocuments as jest.Mock).mockResolvedValue(10)

    const result = await userRepository.getTotal()

    expect(User.countDocuments).toHaveBeenCalledWith({})
    expect(result).toBe(10)
  })
})
