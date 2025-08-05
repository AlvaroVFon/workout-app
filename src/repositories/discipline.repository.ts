import { RootFilterQuery } from 'mongoose'
import { DisciplineDTO } from '../DTOs/discipline/discipline.dto'
import Discipline from '../models/Discipline'
import { ModelQuery } from '../types/index.types'

class DisciplineRepository {
  create(discipline: DisciplineDTO): Promise<DisciplineDTO> {
    return Discipline.create(discipline)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<DisciplineDTO>): Promise<DisciplineDTO | null> {
    return Discipline.findOne(query, projection, options).exec()
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<DisciplineDTO> = {}): Promise<DisciplineDTO[]> {
    return Discipline.find(query, projection, options).exec()
  }

  update(query: RootFilterQuery<DisciplineDTO>, discipline: Partial<DisciplineDTO>): Promise<DisciplineDTO | null> {
    return Discipline.findOneAndUpdate(query, discipline, { new: true }).exec()
  }

  delete(query: RootFilterQuery<DisciplineDTO>): Promise<DisciplineDTO | null> {
    return Discipline.findOneAndDelete(query).exec()
  }
}

export default new DisciplineRepository()
