import { ObjectId } from 'mongodb'

export interface CreateExerciseDTO {
  name: string
  description: string
  muscles: ObjectId[]
  difficulty: string
}
