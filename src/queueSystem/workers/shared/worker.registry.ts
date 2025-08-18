import { Worker } from 'bullmq'
import { WorkerEnum } from '../../utils/workers.enum'
import { createDeadLetterWorker } from '../deadLetter/deadLetterWorker.factory'
import { createEmailWorker } from '../email/emailWorker.factory'

export const workersRegistry: Record<WorkerEnum, () => Worker> = {
  [WorkerEnum.EMAIL]: createEmailWorker,
  [WorkerEnum.DEAD_LETTER]: createDeadLetterWorker,
}
