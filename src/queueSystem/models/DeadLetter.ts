import { Schema, model } from 'mongoose'
import { DeadLetterDTO } from '../deadLetterJob.dto'

const deadLetterJobSchema = new Schema<DeadLetterDTO>({
  jobId: {
    type: String,
  },
  queueName: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
  },
  jobData: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const DeadLetterJob = model('DeadLetterJob', deadLetterJobSchema)

export default DeadLetterJob
