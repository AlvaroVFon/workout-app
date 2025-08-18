import logger from '../../../utils/logger'
import queueService from '../../queue.service'
import { QueueName } from '../../utils/queue.enum'
import { DeadLetterJobData } from './deadLetter.types'

async function enqueueDeadLetterJob(data: DeadLetterJobData) {
  try {
    return await queueService.addJob(QueueName.DEAD_LETTER, data)
  } catch (error) {
    logger.error(`❌ Failed to enqueue dead letter job: id-${data.id}`, error)
    throw error
  }
}

export { enqueueDeadLetterJob }
