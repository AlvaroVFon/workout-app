import { Queue, QueueOptions } from 'bullmq'
import { QueueName } from '../../utils/queue.enum'

export type QueueConfig = {
  name: string
  options: QueueOptions
}

export type QueueRegistry = Record<QueueName, Queue>
