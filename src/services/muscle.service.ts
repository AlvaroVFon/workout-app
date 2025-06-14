import { ProjectionType, RootFilterQuery } from 'mongoose'
import muscleRepository from '../repositories/muscle.repository'
import MuscleDTO from '../DTOs/muscle/muscle.dto'

class MuscleService {
  create(name: string) {
    return muscleRepository.create(name)
  }

  findById(id: string, projection: ProjectionType<MuscleDTO> = {}) {
    return muscleRepository.findById(id, projection)
  }

  findOne(filter: RootFilterQuery<MuscleDTO>, projection: ProjectionType<MuscleDTO> = {}) {
    return muscleRepository.findOne(filter, projection)
  }

  findByName(name: string) {
    return muscleRepository.findOne({ name })
  }

  findAll() {
    return muscleRepository.findAll()
  }

  update(id: string, data: Partial<MuscleDTO>) {
    return muscleRepository.update(id, data)
  }

  delete(id: string) {
    return muscleRepository.delete(id)
  }
}

export default new MuscleService()
