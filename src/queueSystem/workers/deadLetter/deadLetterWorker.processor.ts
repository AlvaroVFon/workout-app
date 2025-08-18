import { Job } from 'bullmq'
import logger from '../../../utils/logger'
import { deadLetterHandler } from '../../jobs/deadLetter/deadLetter.handler'

const deadLetterProcessor = async (job: Job) => {
  try {
    await deadLetterHandler(job)
  } catch (error) {
    logger.error(`❌ Failed to process dead letter job: ${error}`)
    throw error
  }
}

export { deadLetterProcessor }
