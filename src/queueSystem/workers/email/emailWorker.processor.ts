import { Job } from 'bullmq'
import logger from '../../../utils/logger'
import { emailHandler } from '../../jobs/email/email.handler'
import { EmailJobData } from '../../jobs/email/email.types'

const emailJobProcessor = async (job: Job) => {
  try {
    if (job.data?.type !== 'email') {
      logger.info('⏭️  Skipping non-email job')
      return
    }

    const emailJob: EmailJobData = {
      type: job.data.type,
      template: job.data.template,
      payload: job.data.payload,
    }

    await emailHandler(emailJob)
  } catch (error) {
    logger.error(`❌ Email job failed, attempt: ${job.attemptsMade}`)
    throw error
  }
}

export { emailJobProcessor }
