import { connectDatabase } from '../../config/db'
import logger from '../../utils/logger'
import { attachWorkerEvents } from '../events/workers/workerEvents.attacher'
import { WorkerEnum } from '../utils/workers.enum'
import { createWorker } from './shared/worker.factory'
import { workersRegistry } from './shared/worker.registry'

const workers: WorkerEnum[] = Object.keys(workersRegistry) as WorkerEnum[]

async function bootstrap() {
  await connectDatabase()
  for (const workerType of workers) {
    try {
      const createdWorker = createWorker(workerType)
      await attachWorkerEvents(workerType, createdWorker)
      logger.info(`Worker ${createdWorker.name} ready to work`)
    } catch (error) {
      logger.error(`Error creating worker ${workerType}:`, error)
    }
  }
}

bootstrap()
