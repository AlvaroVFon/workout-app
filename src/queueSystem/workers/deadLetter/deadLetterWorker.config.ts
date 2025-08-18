import { parameters } from '../../../config/parameters'
import { QueueName } from '../../utils/queue.enum'
import { WorkerEnum } from '../../utils/workers.enum'
import { WorkerConfig } from '../shared/worker.types'
import { deadLetterProcessor } from './deadLetterWorker.processor'

const config: WorkerConfig = {
  type: WorkerEnum.DEAD_LETTER,
  processor: deadLetterProcessor,
  queueName: QueueName.DEAD_LETTER,
  options: {
    connection: parameters.queueRedisUrl,
    concurrency: 5,
    prefix: parameters.appName,
  },
}

export { config }
