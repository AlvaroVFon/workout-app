import { faker } from '@faker-js/faker'
import { CreateExerciseDTO } from '../DTOs/exercise/create.dto'
import { MusclesEnum } from '../utils/enums/muscles.enum'

function createExercise(exercise?: CreateExerciseDTO): CreateExerciseDTO {
  return {
    name: exercise?.name ?? faker.lorem.words(3),
    description: exercise?.description ?? faker.lorem.paragraph(2),
    difficulty: exercise?.difficulty ?? 'medium',
    muscles: exercise?.muscles ?? Object.values(MusclesEnum),
  }
}

export { createExercise }
