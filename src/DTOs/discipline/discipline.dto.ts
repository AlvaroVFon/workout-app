import { DisciplineCategoryEnum } from '../../utils/enums/discipline-category.enum'
import { DisciplineEnum } from '../../utils/enums/discipline.enum'

export interface DisciplineDTO {
  id: string
  name: DisciplineEnum
  category: DisciplineCategoryEnum[]
  createdAt?: Date
  updatedAt?: Date
}
