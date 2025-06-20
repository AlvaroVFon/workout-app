import { RootFilterQuery, ProjectionType } from 'mongoose'
import Exercise from '../models/Exercise'
import ExerciseDTO from '../DTOs/exercise/exercise.dto'
import { CreateExerciseDTO } from '../DTOs/exercise/create.dto'
import { ModelQuery } from '../types/index.types'

class ExerciseRepository {
  create(data: CreateExerciseDTO) {
    return Exercise.create(data)
  }

  findById(id: string, projection?: ProjectionType<ExerciseDTO>) {
    return Exercise.findById(id, projection).populate('muscles', { name: 1 })
  }

  findOne(filter: RootFilterQuery<ExerciseDTO>, projection?: ProjectionType<ExerciseDTO>) {
    return Exercise.findOne(filter, projection).populate('muscles', {
      name: 1,
    })
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<ExerciseDTO> = {}) {
    return Exercise.find(query, projection, options).populate('muscles', { name: 1 })
  }

  update(id: string, data: Partial<ExerciseDTO>) {
    return Exercise.findOneAndUpdate({ _id: id }, data, { new: true }).populate('muscles', {
      name: 1,
    })
  }

  delete(id: string) {
    return Exercise.findOneAndDelete({ _id: id })
  }

  getTotal(query: RootFilterQuery<ExerciseDTO> = {}) {
    return Exercise.countDocuments(query)
  }
}

export default new ExerciseRepository()
