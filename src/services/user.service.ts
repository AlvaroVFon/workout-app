import userRepository from '../repositories/user.repository'
import { UserDTO } from '../DTOs/user/user.dto'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { UpdateUserDTO } from '../DTOs/user/update.dto'
import { hashPassword } from '../helpers/hashPassword'
import roleService from './role.service'
import NotFoundException from '../exceptions/NotFoundException'

class UserService {
  async create(data: CreateUserDTO): Promise<UserDTO> {
    const role = await roleService.findByName(data.role)
    if (!role) throw new NotFoundException(`Invalid role: ${data.role}`)

    data.password = await hashPassword(data.password)
    data.role = role._id.toString()

    return await userRepository.create(data)
  }

  async findAll(): Promise<UserDTO[]> {
    return await userRepository.findAll()
  }

  async findById(id: string): Promise<UserDTO | null> {
    return await userRepository.findById(id)
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    return await userRepository.findOneByEmail(email)
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserDTO | null> {
    data.updatedAt = Date.now()

    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    return await userRepository.update(id, data)
  }

  async delete(id: string): Promise<UserDTO | null> {
    return await userRepository.delete(id)
  }
}

export default new UserService()
