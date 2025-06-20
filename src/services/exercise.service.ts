import { ProjectionType, RootFilterQuery } from 'mongoose'
import exerciseRepository from '../repositories/exercise.repository'
import muscleRepository from '../repositories/muscle.repository'
import ExerciseDTO from '../DTOs/exercise/exercise.dto'
import { CreateExerciseDTO } from '../DTOs/exercise/create.dto'
import { ModelQuery } from '../types/index.types'
import NotFoundException from '../exceptions/NotFoundException'

class ExerciseService {
  async create(exercise: CreateExerciseDTO) {
    const muscles = await muscleRepository.findAll({ query: { name: { $in: exercise.muscles } } })
    if (!muscles || muscles.length !== exercise.muscles.length) {
      throw new NotFoundException('One or more muscles not found')
    }
    exercise.muscles = muscles.map((muscle) => muscle._id.toString())
    return exerciseRepository.create(exercise)
  }

  findById(id: string, projection: ProjectionType<ExerciseDTO> = {}) {
    return exerciseRepository.findById(id, projection)
  }

  findOne(filter: RootFilterQuery<ExerciseDTO>, projection: ProjectionType<ExerciseDTO> = {}) {
    return exerciseRepository.findOne(filter, projection)
  }

  findByName(name: string) {
    return exerciseRepository.findOne({ name })
  }

  findAll(query: ModelQuery<ExerciseDTO> = {}) {
    return exerciseRepository.findAll(query)
  }

  update(id: string, data: Partial<ExerciseDTO>) {
    return exerciseRepository.update(id, data)
  }

  delete(id: string) {
    return exerciseRepository.delete(id)
  }

  getTotal(query: RootFilterQuery<ExerciseDTO> = {}) {
    return exerciseRepository.getTotal(query)
  }
}

export default new ExerciseService()
