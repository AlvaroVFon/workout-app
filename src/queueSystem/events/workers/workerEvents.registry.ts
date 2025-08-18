import { Worker } from 'bullmq'
import { WorkerEnum } from '../../utils/workers.enum'
import { attachDeadLetterWorkerEvents } from './deadLetterWorker.events'
import { attachEmailWorkerEvents } from './emailWorker.events'

export const eventRegistry: Record<WorkerEnum, (worker: Worker) => Promise<void>> = {
  [WorkerEnum.EMAIL]: attachEmailWorkerEvents,
  [WorkerEnum.DEAD_LETTER]: attachDeadLetterWorkerEvents,
}
