import { ProjectionType, RootFilterQuery } from 'mongoose'
import Role from '../models/Role'
import RoleDTO from '../DTOs/role/role.dto'

class RoleRepository {
  create(name: string) {
    return Role.create({ name })
  }

  findById(id: string, projection: ProjectionType<RoleDTO> = {}) {
    return Role.findById(id, projection)
  }

  findOne(filter: RootFilterQuery<RoleDTO>, projection: ProjectionType<RoleDTO> = {}) {
    return Role.findOne(filter, projection)
  }

  findAll() {
    return Role.find()
  }

  update(id: string, data: Partial<RoleDTO>) {
    return Role.findOneAndUpdate({ _id: id }, data)
  }

  delete(id: string) {
    return Role.findOneAndDelete({ _id: id })
  }
}

export default new RoleRepository()
