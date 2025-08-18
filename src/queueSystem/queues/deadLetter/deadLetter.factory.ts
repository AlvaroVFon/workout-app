import { Queue } from 'bullmq'
import { config } from './deadLetter.config'

function createDeadLetterQueue() {
  return new Queue(config.name, config.options)
}

export { createDeadLetterQueue }
