import { ObjectId } from 'mongodb'
import { CreateAthleteDTO } from '../DTOs/athlete/create.dto'
import athleteRepository from '../repositories/athlete.repository'
import { ModelQuery } from '../types/index.types'
import AthleteDTO from '../DTOs/athlete/athlete.dto'
import { RootFilterQuery } from 'mongoose'

class AthleteService {
  create(athlete: CreateAthleteDTO, coachId: ObjectId) {
    athlete.coach = new ObjectId(coachId)
    return athleteRepository.create(athlete)
  }

  async findOne({ query = {}, projection = {}, options = {} }: ModelQuery<AthleteDTO> = {}) {
    return athleteRepository.findOne({ query, projection, options })
  }

  async findAll({ query = {}, projection = {}, options = {} }: ModelQuery<AthleteDTO> = {}) {
    return athleteRepository.findAll({ query, projection, options })
  }

  async update(id: string, updateData: Partial<AthleteDTO>) {
    return athleteRepository.update(id, updateData)
  }

  async delete(id: string) {
    return athleteRepository.delete(id)
  }

  async getTotal(query: RootFilterQuery<AthleteDTO> = {}) {
    return athleteRepository.getTotal(query)
  }
}

export default new AthleteService()
