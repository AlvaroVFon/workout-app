import { faker } from '@faker-js/faker'
import { DisciplineDTO } from '../DTOs/discipline/discipline.dto'

export const createDiscipline = (discipline: Partial<DisciplineDTO>): DisciplineDTO => {
  return {
    name: discipline.name || faker.lorem.words(2),
    categories: discipline.categories || [faker.lorem.word()],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as DisciplineDTO
}
