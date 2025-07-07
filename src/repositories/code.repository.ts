import { RootFilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import { CodeDTO } from '../DTOs/code/code.dto'
import { CreateCodeDTO } from '../DTOs/code/create.dto'
import Code from '../models/Code'
import { ModelQuery } from '../types/index.types'

class CodeRepository {
  create(code: CreateCodeDTO) {
    return Code.create(code)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<CodeDTO> = {}) {
    return Code.findOne(query, projection, options).exec()
  }

  findById(id: string, projection: ProjectionType<CodeDTO> = {}, options: QueryOptions = {}) {
    return Code.findById(id, projection, options).exec()
  }

  findAll({ query = {}, projection = {}, options = {} }: ModelQuery<CodeDTO>) {
    return Code.find(query, projection, options).exec()
  }

  update(query: RootFilterQuery<CodeDTO>, updateData: Partial<CodeDTO>) {
    return Code.findOneAndUpdate(query, updateData, { new: true }).exec()
  }

  delete(query: RootFilterQuery<CodeDTO>) {
    return Code.findOneAndDelete(query).exec()
  }
}

export default new CodeRepository()
