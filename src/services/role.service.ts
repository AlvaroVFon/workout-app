import { ProjectionType, RootFilterQuery } from 'mongoose'
import roleRepository from '../repositories/role.repository'
import RoleDTO from '../DTOs/role/role.dto'

class RoleService {
  create(name: string) {
    return roleRepository.create(name)
  }

  findById(id: string, projection: ProjectionType<RoleDTO> = {}) {
    return roleRepository.findById(id, projection)
  }

  findOne(filter: RootFilterQuery<RoleDTO>, projection: ProjectionType<RoleDTO> = {}) {
    return roleRepository.findOne(filter, projection)
  }

  findByName(name: string) {
    return roleRepository.findOne({ name })
  }

  findAll() {
    return roleRepository.findAll()
  }

  update(id: string, data: Partial<RoleDTO>) {
    return roleRepository.update(id, data)
  }

  delete(id: string) {
    return roleRepository.delete(id)
  }
}

export default new RoleService()
