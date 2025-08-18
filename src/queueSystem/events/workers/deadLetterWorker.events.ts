import { Job, Worker } from 'bullmq'

async function attachDeadLetterWorkerEvents(worker: Worker) {
  worker.on('completed', (job: Job) => {
    console.log(`✅ Dead letter worker completed job ${job.id}`)
  })

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`❌ Dead letter worker failed job ${job?.id}:`, err.message)
  })
}

export { attachDeadLetterWorkerEvents }
