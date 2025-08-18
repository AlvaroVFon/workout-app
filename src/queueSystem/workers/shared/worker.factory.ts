import { Worker } from 'bullmq'
import { WorkerEnum } from '../../utils/workers.enum'
import { workersRegistry } from './worker.registry'

function createWorker(type: WorkerEnum): Worker {
  if (!workersRegistry[type]) throw new Error(`Worker ${type} is not registered`)
  return workersRegistry[type]()
}

export { createWorker }
