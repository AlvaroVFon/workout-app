import { RootFilterQuery, ProjectionType } from 'mongoose'
import Muscle from '../models/Muscle'
import MuscleDTO from '../DTOs/muscle/muscle.dto'
import { ModelQuery } from '../types/index.types'

class MuscleRepository {
  create(name: string) {
    return Muscle.create({ name })
  }

  findById(id: string, projection?: ProjectionType<MuscleDTO>) {
    return Muscle.findById(id, projection)
  }

  findOne(filter: RootFilterQuery<MuscleDTO>, projection?: ProjectionType<MuscleDTO>) {
    return Muscle.findOne(filter, projection)
  }

  findByName(name: string, projection?: ProjectionType<MuscleDTO>) {
    return Muscle.findOne({ name }, projection)
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<MuscleDTO> = {}) {
    return Muscle.find(query, projection, options)
  }

  update(id: string, data: Partial<MuscleDTO>) {
    return Muscle.findOneAndUpdate({ _id: id }, data, { new: true })
  }

  delete(id: string) {
    return Muscle.findOneAndDelete({ _id: id })
  }
}

export default new MuscleRepository()
