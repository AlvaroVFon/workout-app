import { Schema, model } from 'mongoose'
import { DisciplineDTO } from '../DTOs/discipline/discipline.dto'
import { DisciplineCategoryEnum } from '../utils/enums/discipline-category.enum'
import { DisciplineEnum } from '../utils/enums/discipline.enum'

const disciplineSchema = new Schema<DisciplineDTO>({
  name: {
    type: String,
    enum: Object.values(DisciplineEnum),
    unique: true,
    required: true,
  },
  categories: {
    type: [String],
    enum: Object.values(DisciplineCategoryEnum),
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
})

const Discipline = model<DisciplineDTO>('Discipline', disciplineSchema)

export default Discipline
