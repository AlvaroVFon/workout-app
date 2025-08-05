import { ObjectId } from 'mongodb'
import { Gender } from '../../types/index.types'

interface AthleteDTO {
  id: string
  email: string
  firstname: string
  lastname: string
  coach: ObjectId
  idDocument: string
  disciplines?: ObjectId[]
  gender?: Gender
  height?: number
  weight?: number
  goals?: string[]
  notes?: string
  phone?: string
}

export default AthleteDTO
