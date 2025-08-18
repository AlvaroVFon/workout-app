import { JobsOptions } from 'bullmq'
import { queueRegistry } from './queues/shared/queue.registry'
import { QueueRegistry } from './queues/shared/queue.types'
import { QueueName } from './utils/queue.enum'

class QueueService {
  private queues: QueueRegistry = queueRegistry

  async addJob<T>(queueName: QueueName, jobData: T, options?: JobsOptions) {
    return this.queues[queueName].add(queueName, jobData, options)
  }
}

export default new QueueService()
