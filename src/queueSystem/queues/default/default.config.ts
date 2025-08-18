import { parameters } from '../../../config/parameters'
import { QueueName } from '../../utils/queue.enum'
import { QueueConfig } from '../shared/queue.types'

export const config: QueueConfig = {
  name: QueueName.DEFAULT,
  options: {
    defaultJobOptions: {
      attempts: parameters.queueMaxAttempts,
      backoff: parameters.queueBackoff,
    },
    connection: {
      url: parameters.queueRedisUrl,
    },
    prefix: parameters.appName,
  },
}
