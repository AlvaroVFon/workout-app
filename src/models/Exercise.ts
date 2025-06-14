import { Schema, model, Types } from 'mongoose'
import Exercise from '../DTOs/exercise/exercise.dto'

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
    ref: 'Muscles',
    required: true,
  },
})

const Exercise = model<Exercise>('Exercise', exerciseSchema)

export default Exercise
