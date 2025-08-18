import { QueueName } from '../../utils/queue.enum'
import { createDeadLetterQueue } from '../deadLetter/deadLetter.factory'
import { createDefaultQueue } from '../default/default.factory'
import { QueueRegistry } from './queue.types'

export const queueRegistry: QueueRegistry = {
  [QueueName.DEFAULT]: createDefaultQueue(),
  [QueueName.DEAD_LETTER]: createDeadLetterQueue(),
}
