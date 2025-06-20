import { Document, RootFilterQuery } from 'mongoose'
import User from '../models/User'
import { UserDTO } from '../DTOs/user/user.dto'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { UpdateUserDTO } from '../DTOs/user/update.dto'
import { ModelQuery } from '../types/index.types'

class UserRepository {
  create(data: CreateUserDTO): Promise<UserDTO & Document> {
    return User.create(data)
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<UserDTO> = {}): Promise<(UserDTO & Document)[]> {
    return User.find(query, projection, options).populate('role')
  }

  findById(id: string): Promise<(UserDTO & Document) | null> {
    return User.findOne({ _id: id }).populate('role')
  }

  findOneByEmail(email: string): Promise<(UserDTO & Document) | null> {
    return User.findOne({ email }).exec()
  }

  update(id: string, data: UpdateUserDTO): Promise<(UserDTO & Document) | null> {
    return User.findByIdAndUpdate({ _id: id }, data, { new: true }).exec()
  }

  delete(id: string): Promise<(UserDTO & Document) | null> {
    return User.findByIdAndDelete({ _id: id }).exec()
  }

  getTotal(query: RootFilterQuery<UserDTO> = {}) {
    return User.countDocuments(query)
  }
}

export default new UserRepository()
