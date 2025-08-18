import { Job, Worker } from 'bullmq'
import { JobEnum } from '../../../utils/enums/jobs/jobs.enum'
import logger from '../../../utils/logger'
import { enqueueDeadLetterJob } from '../../jobs/deadLetter/deadLetter.job'

async function attachEmailWorkerEvents(worker: Worker) {
  worker.on('completed', (job: Job) => {
    logger.info(`Job with id :${job.id} completed`)
  })

  worker.on('failed', (job: Job | undefined, err: Error) => {
    const maxAttempts = job?.opts.attempts ?? 1
    const attemptsMade = job?.attemptsMade ?? 0

    if (attemptsMade >= maxAttempts) {
      enqueueDeadLetterJob({
        id: job?.id ?? 'unknown',
        type: JobEnum.EMAIL,
        payload: job?.data,
        error: err,
        timestamp: new Date(),
      })
    }
  })
}

export { attachEmailWorkerEvents }
