import { Schema, model, Types, Document } from 'mongoose'
import { SetDTO, ExerciseEntryDTO, TrainingSessionDTO } from '../DTOs/trainingSession/trainingSession.dto'

const setSchema = new Schema<SetDTO>(
  {
    reps: { type: Number, required: true },
    weight: { type: Number },
    rir: { type: Number, min: 0, max: 5 },
  },
  { _id: false },
)

const exerciseEntrySchema = new Schema<ExerciseEntryDTO>(
  {
    exercise: { type: Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: [setSchema], required: true },
  },
  { _id: false },
)

const trainingSessionSchema = new Schema<TrainingSessionDTO>(
  {
    athlete: { type: Types.ObjectId, ref: 'Athlete', required: true },
    date: { type: Date, required: true, default: () => Date.now() },
    type: {
      type: String,
      enum: ['strength', 'endurance', 'explosive', 'mobility', 'other'],
      required: true,
    },
    exercises: { type: [exerciseEntrySchema], required: true },
    sessionDuration: { type: Number, min: 0 },
    perceivedEffort: { type: Number, min: 1, max: 10 },
    notes: { type: String },
    week: { type: Number },
    month: { type: Number },
    year: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true },
)

trainingSessionSchema.pre('save', function (this: Document & TrainingSessionDTO, next) {
  const date = this.get('date') ? new Date(this.get('date')) : new Date()
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = (date.getTime() - start.getTime()) / 86400000
  this.set('week', Math.ceil((diff + start.getDay() + 1) / 7))
  this.set('month', date.getMonth() + 1)
  this.set('year', date.getFullYear())
  next()
})

export default model<TrainingSessionDTO>('TrainingSession', trainingSessionSchema)
