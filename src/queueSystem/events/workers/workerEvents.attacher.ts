import { Worker } from 'bullmq'
import { WorkerEnum } from '../../utils/workers.enum'
import { eventRegistry } from './workerEvents.registry'

async function attachWorkerEvents(type: WorkerEnum, worker: Worker) {
  if (!eventRegistry[type]) throw new Error(`Worker with type: ${type} is not registered`)
  return await eventRegistry[type](worker)
}

export { attachWorkerEvents }
