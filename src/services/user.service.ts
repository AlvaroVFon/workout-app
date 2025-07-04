import { RootFilterQuery } from 'mongoose'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { UpdateUserDTO } from '../DTOs/user/update.dto'
import { UserDTO } from '../DTOs/user/user.dto'
import NotFoundException from '../exceptions/NotFoundException'
import { hashString } from '../helpers/crypto.helper'
import userRepository from '../repositories/user.repository'
import { ModelQuery } from '../types/index.types'
import roleService from './role.service'

class UserService {
  async create(data: CreateUserDTO): Promise<UserDTO> {
    const role = await roleService.findByName(data.role)
    if (!role) throw new NotFoundException(`Invalid role: ${data.role}`)

    data.password = await hashString(data.password)
    data.role = role._id.toString()

    return userRepository.create(data)
  }

  async findAll({ query = {}, projection = {}, options = {} }: ModelQuery<UserDTO> = {}): Promise<UserDTO[]> {
    return userRepository.findAll({ query, projection, options })
  }

  async findById(id: string): Promise<UserDTO | null> {
    return userRepository.findById(id)
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    return userRepository.findOneByEmail(email)
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserDTO | null> {
    data.updatedAt = Date.now()

    if (data.password) {
      data.password = await hashString(data.password)
    }

    return userRepository.update(id, data)
  }

  async delete(id: string): Promise<UserDTO | null> {
    return userRepository.delete(id)
  }

  async getTotal(query: RootFilterQuery<UserDTO> = {}) {
    return userRepository.getTotal(query)
  }
}

export default new UserService()
