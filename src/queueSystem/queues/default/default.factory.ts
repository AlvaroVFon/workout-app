import { Queue } from 'bullmq'
import { config } from './default.config'

function createDefaultQueue(): Queue {
  return new Queue(config.name, config.options)
}

export { createDefaultQueue }
