import { Worker } from 'bullmq'
import { config } from './deadLetterWorker.config'

function createDeadLetterWorker() {
  return new Worker(config.queueName, config.processor, { ...config.options })
}

export { createDeadLetterWorker }
