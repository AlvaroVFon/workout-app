import { Worker } from 'bullmq'
import { config } from './emailWorker.config'

//Ahora mismo hay una unica cola, por tanto lo que diferencia un worker de otro es el processor
function createEmailWorker(): Worker {
  return new Worker(config.queueName, config.processor, {
    ...config.options,
  })
}

export { createEmailWorker }
