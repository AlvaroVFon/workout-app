import { Schema, model } from 'mongoose'
import Muscle from '../DTOs/muscle/muscle.dto'

const muscleSchema = new Schema<Muscle>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
})

const Muscle = model<Muscle>('Muscle', muscleSchema)
export default Muscle
