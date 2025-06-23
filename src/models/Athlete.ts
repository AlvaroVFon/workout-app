import { Schema, Types, model } from 'mongoose'
import AthleteDTO from '../DTOs/athlete/athlete.dto'

const athleteSchema = new Schema<AthleteDTO>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  coach: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gender: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  goals: {
    type: [String],
  },
  idDocument: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
  },
})

const Athlete = model<AthleteDTO>('Athlete', athleteSchema)

export default Athlete
