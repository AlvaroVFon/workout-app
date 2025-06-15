import { ProjectionType, RootFilterQuery } from 'mongoose'
import exerciseRepository from '../repositories/exercise.repository'
import muscleRepository from '../repositories/muscle.repository'
import ExerciseDTO from '../DTOs/exercise/exercise.dto'
import { CreateExerciseDTO } from '../DTOs/exercise/create.dto'

class ExerciseService {
  async create(exercise: CreateExerciseDTO) {
    const query = { name: { $in: exercise.muscles } }
    const projection = { _id: 1 }
    const muscleIds = await muscleRepository.findAll(query, projection)

    exercise.muscles = muscleIds.map((muscle) => muscle._id)
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

  findAll(query: RootFilterQuery<ExerciseDTO> = {}, projection?: ProjectionType<ExerciseDTO>) {
    return exerciseRepository.findAll(query, projection)
  }

  update(id: string, data: Partial<ExerciseDTO>) {
    return exerciseRepository.update(id, data)
  }

  delete(id: string) {
    return exerciseRepository.delete(id)
  }
}

export default new ExerciseService()
