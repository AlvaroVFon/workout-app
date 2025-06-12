import { Document } from 'mongoose'
import User from '../models/User'
import { UserDTO } from '../DTOs/user/user.dto'
import { CreateUserDTO } from '../DTOs/user/create.dto'
import { UpdateUserDTO } from '../DTOs/user/update.dto'

class UserRepository {
  create(data: CreateUserDTO): Promise<UserDTO & Document> {
    return User.create(data)
  }

  findAll(): Promise<(UserDTO & Document)[]> {
    return User.find().exec()
  }

  findById(id: string): Promise<(UserDTO & Document) | null> {
    return User.findOne({ _id: id }).exec()
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
}

export default new UserRepository()
