import { ObjectId } from 'mongodb'
import { TrainingTypeEnum } from '../../utils/enums/trainingTypes.enum'

export interface SetDTO {
  reps: number
  weight?: number
  rir?: number
}

export interface ExerciseEntryDTO {
  exercise: ObjectId
  sets: SetDTO[]
}

export interface TrainingSessionDTO {
  athlete: ObjectId
  date: Date
  type: TrainingTypeEnum
  exercises: ExerciseEntryDTO[]
  sessionDuration?: number
  perceivedEffort?: number
  notes?: string
  week?: number
  month?: number
  year?: number
  tags?: string[]
}
