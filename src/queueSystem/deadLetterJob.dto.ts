import { JobEnum } from '../utils/enums/jobs/jobs.enum'
import { QueueName } from './utils/queue.enum'

export type DeadLetterDTO = {
  jobId: string
  queueName: QueueName
  jobData: object
  jobType?: JobEnum
  createdAt?: Date
}
