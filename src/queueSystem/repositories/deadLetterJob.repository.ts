import { Job } from 'bullmq'
import { RootFilterQuery } from 'mongoose'
import { ModelQuery } from '../../types/index.types'
import logger from '../../utils/logger'
import { DeadLetterDTO } from '../deadLetterJob.dto'
import deadLetterJob from '../models/DeadLetter'

class DeadLetterJobRepository {
  async create(job: Job) {
    try {
      return await deadLetterJob.create({
        jobId: job.id,
        queueName: job.queueName,
        jobData: job.data,
      })
    } catch (error) {
      logger.error('❌ Database save error:', error)
      throw error
    }
  }

  async findOne({ query = {}, projection = {}, options = {} }: ModelQuery<DeadLetterDTO>) {
    return await deadLetterJob.findOne(query, projection, options).exec()
  }

  async findAll({ query = {}, projection = {}, options = {} }: ModelQuery<DeadLetterDTO>) {
    return await deadLetterJob.find(query, projection, options).exec()
  }

  async update(query: RootFilterQuery<DeadLetterDTO>, data: Partial<DeadLetterDTO>) {
    return await deadLetterJob.findOneAndUpdate(query, data, { new: true }).exec()
  }

  async delete(query: RootFilterQuery<DeadLetterDTO>) {
    return await deadLetterJob.findOneAndDelete(query).exec()
  }
}

const deadLetterJobRepository = new DeadLetterJobRepository()

export default deadLetterJobRepository
