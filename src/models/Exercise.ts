import { Schema, model, Types } from 'mongoose'
import Exercise from '../DTOs/exercise/exercise.dto'
import { DifficultyEnum } from '../utils/enums/difficulty.enum'

const exerciseSchema = new Schema<Exercise>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  muscles: {
    type: [Types.ObjectId],
    ref: 'Muscle',
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: Object.values(DifficultyEnum),
  },
})

const Exercise = model<Exercise>('Exercise', exerciseSchema)

export default Exercise
