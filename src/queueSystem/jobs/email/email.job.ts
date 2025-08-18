import queueService from '../../queue.service'
import { QueueName } from '../../utils/queue.enum'
import type { EmailJobData } from './email.types'

async function enqueueEmailJob(data: EmailJobData): Promise<void> {
  await queueService.addJob<EmailJobData>(QueueName.DEFAULT, data)
}

export { enqueueEmailJob }
