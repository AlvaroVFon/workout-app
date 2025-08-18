import { parameters } from '../../../config/parameters'
import { QueueName } from '../../utils/queue.enum'
import { WorkerEnum } from '../../utils/workers.enum'
import { WorkerConfig } from '../shared/worker.types'
import { emailJobProcessor } from './emailWorker.processor'

const config: WorkerConfig = {
  type: WorkerEnum.EMAIL,
  processor: emailJobProcessor,
  queueName: QueueName.DEFAULT,
  options: {
    connection: parameters.queueRedisUrl,
    concurrency: 5,
    prefix: parameters.appName,
  },
}

export { config }
