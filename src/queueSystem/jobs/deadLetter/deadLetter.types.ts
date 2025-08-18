import { JobEnum } from '../../../utils/enums/jobs/jobs.enum'

export interface DeadLetterJobData {
  type: JobEnum
  id: string
  payload: object
  error?: Error
  timestamp?: Date
}
