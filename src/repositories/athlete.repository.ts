import { ProjectionType, RootFilterQuery } from 'mongoose'
import { CreateAthleteDTO } from '../DTOs/athlete/create.dto'
import AthleteDTO from '../DTOs/athlete/athlete.dto'
import Athlete from '../models/Athlete'
import { ModelQuery } from '../types/index.types'

class AthleteRepository {
  create(data: CreateAthleteDTO) {
    return Athlete.create(data)
  }

  findById(id: string, projection?: ProjectionType<AthleteDTO>) {
    return Athlete.findOne({ _id: id }, projection)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<AthleteDTO>) {
    return Athlete.findOne(query, projection, options)
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<AthleteDTO>) {
    return Athlete.find(query, projection, options)
  }

  update(id: string, data: Partial<AthleteDTO>) {
    return Athlete.findOneAndUpdate({ _id: id }, data, { new: true })
  }

  delete(id: string) {
    return Athlete.findOneAndDelete({ _id: id })
  }

  getTotal(query: RootFilterQuery<AthleteDTO> = {}) {
    return Athlete.countDocuments(query)
  }
}

export default new AthleteRepository()
