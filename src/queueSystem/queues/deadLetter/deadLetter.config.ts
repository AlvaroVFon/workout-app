import { parameters } from '../../../config/parameters'
import { QueueName } from '../../utils/queue.enum'
import { QueueConfig } from '../shared/queue.types'

export const config: QueueConfig = {
  name: QueueName.DEAD_LETTER,
  options: {
    connection: parameters.queueRedisUrl,
    prefix: parameters.appName,
  },
}
