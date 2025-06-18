import { RootFilterQuery, ProjectionType } from 'mongoose'
import Exercise from '../models/Exercise'
import ExerciseDTO from '../DTOs/exercise/exercise.dto'
import { CreateExerciseDTO } from '../DTOs/exercise/create.dto'

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

  findAll(query: RootFilterQuery<ExerciseDTO>, projection?: ProjectionType<ExerciseDTO>) {
    return Exercise.find(query, projection).populate('muscles', { name: 1 })
  }

  update(id: string, data: Partial<ExerciseDTO>) {
    return Exercise.findOneAndUpdate({ _id: id }, data, { new: true }).populate('muscles', {
      name: 1,
    })
  }

  delete(id: string) {
    return Exercise.findOneAndDelete({ _id: id })
  }
}

export default new ExerciseRepository()
