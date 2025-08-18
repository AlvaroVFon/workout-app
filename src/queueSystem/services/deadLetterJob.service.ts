import { Job } from 'bullmq'
import { RootFilterQuery } from 'mongoose'
import { ModelQuery } from '../../types/index.types'
import { DeadLetterDTO } from '../deadLetterJob.dto'
import deadLetterJobRepository from '../repositories/deadLetterJob.repository'

class DeadLetterJobService {
  async create(job: Job) {
    return await deadLetterJobRepository.create(job)
  }

  async findOne({ query = {}, projection = {}, options = {} }: ModelQuery<DeadLetterDTO>) {
    return deadLetterJobRepository.findOne({ query, projection, options })
  }

  async findAll({ query = {}, projection = {}, options = {} }: ModelQuery<DeadLetterDTO>) {
    return deadLetterJobRepository.findAll({ query, projection, options })
  }

  async update(query: RootFilterQuery<DeadLetterDTO>, data: Partial<DeadLetterDTO>) {
    return deadLetterJobRepository.update(query, data)
  }

  async delete(query: RootFilterQuery<DeadLetterDTO>) {
    return deadLetterJobRepository.delete(query)
  }
}

const deadLetterJobService = new DeadLetterJobService()

export default deadLetterJobService
