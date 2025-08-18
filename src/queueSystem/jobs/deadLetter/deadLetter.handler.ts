import { Job } from 'bullmq'
import logger from '../../../utils/logger'
import deadLetterJobService from '../../services/deadLetterJob.service'

async function deadLetterHandler(job: Job) {
  try {
    await deadLetterJobService.create(job)
  } catch (error) {
    logger.error(`Error processing dead letter job ${job?.id}`, error)
    throw error
  }
}

export { deadLetterHandler }
