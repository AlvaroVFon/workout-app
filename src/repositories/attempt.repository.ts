import { DeleteResult, RootFilterQuery } from 'mongoose'
import { AttemptDTO } from '../DTOs/attempt/attempt.dto'
import { CreateAttemptDTO } from '../DTOs/attempt/create.dto'
import Attempt from '../models/Attempt'
import { ModelQuery } from '../types/index.types'

class AttemptRepository {
  create(attempt: CreateAttemptDTO): Promise<AttemptDTO> {
    return Attempt.create(attempt)
  }

  findOne({ query = {}, projection = {}, options = {} }: ModelQuery<AttemptDTO>) {
    return Attempt.findOne(query, projection, options).exec()
  }

  count(query: RootFilterQuery<AttemptDTO> = {}): Promise<number> {
    return Attempt.countDocuments(query).exec()
  }

  delete(query: RootFilterQuery<AttemptDTO>): Promise<DeleteResult> {
    return Attempt.deleteOne(query).exec()
  }
}

export default new AttemptRepository()
