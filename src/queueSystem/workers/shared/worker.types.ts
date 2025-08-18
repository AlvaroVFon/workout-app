import { Job, WorkerOptions } from 'bullmq'
import { QueueName } from '../../utils/queue.enum'
import { WorkerEnum } from '../../utils/workers.enum'

export type WorkerConfig = {
  type: WorkerEnum
  processor: (job: Job) => Promise<void>
  queueName: QueueName
  options: WorkerOptions
}
