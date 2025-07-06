import { DeleteResult, RootFilterQuery } from 'mongoose'
import { CreateAttemptDTO } from '../DTOs/attempt/create.dto'
import { AttemptDTO } from '../DTOs/attempt/attempt.dto'
import Attempt from '../models/Attempt'
import { ModelQuery } from '../types/index.types'

//TODO: simplificar repository, remove unnecessary methods and use generic repository pattern
class RecoveryAttemptRepository {
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
export default new RecoveryAttemptRepository()
