import { ProjectionType, RootFilterQuery } from 'mongoose'
import exerciseRepository from '../repositories/exercise.repository'
import ExerciseDTO from '../DTOs/exercise/exercise.dto'
import { CreateExerciseDTO } from '../DTOs/exercise/create.dto'
import { areValidMuscles } from '../helpers/muscle.helper'
import NotFoundException from '../exceptions/NotFoundException'

class ExerciseService {
  async create(exercise: CreateExerciseDTO) {
    const areValidExerciseMuscles: boolean = await areValidMuscles(exercise.muscles)
    if (!areValidExerciseMuscles) throw new NotFoundException('One or more of the provided muscles is invalid.')

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

  update(id: string, data: Partial<ExerciseDTO>) {
    return exerciseRepository.update(id, data)
  }

  delete(id: string) {
    return exerciseRepository.delete(id)
  }
}

export default new ExerciseService()
