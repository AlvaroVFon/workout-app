import { JobsOptions } from 'bullmq'
import queueService from '../../../src/queueSystem/queue.service'
import { queueRegistry } from '../../../src/queueSystem/queues/shared/queue.registry'
import { QueueName } from '../../../src/queueSystem/utils/queue.enum'

jest.mock('../../../src/queueSystem/queues/shared/queue.registry')

describe('QueueService', () => {
  const mockQueue = {
    add: jest.fn(),
  }

  const mockQueueRegistry = {
    [QueueName.DEFAULT]: mockQueue,
    [QueueName.DEAD_LETTER]: mockQueue,
  }

  beforeEach(() => {
    ;(queueRegistry as any) = mockQueueRegistry
    // Reset the private queues property to use the mocked registry
    ;(queueService as any).queues = mockQueueRegistry
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addJob', () => {
    const mockJobData = {
      email: 'test@example.com',
      code: '123456',
    }

    it('should add a job to the default queue without options', async () => {
      const expectedResult = { id: 'job-123', queueName: QueueName.DEFAULT }
      mockQueue.add.mockResolvedValue(expectedResult)

      const result = await queueService.addJob(QueueName.DEFAULT, mockJobData)

      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, mockJobData, undefined)
      expect(result).toEqual(expectedResult)
    })

    it('should add a job to the default queue with options', async () => {
      const expectedResult = { id: 'job-123', queueName: QueueName.DEFAULT }
      const options: JobsOptions = {
        delay: 5000,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
      mockQueue.add.mockResolvedValue(expectedResult)

      const result = await queueService.addJob(QueueName.DEFAULT, mockJobData, options)

      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, mockJobData, options)
      expect(result).toEqual(expectedResult)
    })

    it('should add a job to the dead letter queue', async () => {
      const deadLetterJobData = {
        jobId: 'failed-job-456',
        originalQueue: QueueName.DEFAULT,
        error: 'Processing failed',
      }
      const expectedResult = { id: 'dead-letter-job-789', queueName: QueueName.DEAD_LETTER }
      mockQueue.add.mockResolvedValue(expectedResult)

      const result = await queueService.addJob(QueueName.DEAD_LETTER, deadLetterJobData)

      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEAD_LETTER, deadLetterJobData, undefined)
      expect(result).toEqual(expectedResult)
    })

    it('should add a job with complex options', async () => {
      const expectedResult = { id: 'job-complex-123', queueName: QueueName.DEFAULT }
      const complexOptions: JobsOptions = {
        delay: 10000,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        priority: 10,
        removeOnComplete: 100,
        removeOnFail: 50,
      }
      mockQueue.add.mockResolvedValue(expectedResult)

      const result = await queueService.addJob(QueueName.DEFAULT, mockJobData, complexOptions)

      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, mockJobData, complexOptions)
      expect(result).toEqual(expectedResult)
    })

    it('should handle queue add errors', async () => {
      const error = new Error('Queue is not available')
      mockQueue.add.mockRejectedValue(error)

      await expect(queueService.addJob(QueueName.DEFAULT, mockJobData)).rejects.toThrow(error)
      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, mockJobData, undefined)
    })

    it('should handle different data types', async () => {
      const stringData = 'simple string data'
      const numberData = 42
      const arrayData = [1, 2, 3, 'test']
      const expectedResult = { id: 'job-data-types', queueName: QueueName.DEFAULT }

      mockQueue.add.mockResolvedValue(expectedResult)

      // Test string data
      await queueService.addJob(QueueName.DEFAULT, stringData)
      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, stringData, undefined)

      // Test number data
      await queueService.addJob(QueueName.DEFAULT, numberData)
      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, numberData, undefined)

      // Test array data
      await queueService.addJob(QueueName.DEFAULT, arrayData)
      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, arrayData, undefined)
    })

    it('should handle null and undefined job data', async () => {
      const expectedResult = { id: 'job-null', queueName: QueueName.DEFAULT }
      mockQueue.add.mockResolvedValue(expectedResult)

      // Test null data
      await queueService.addJob(QueueName.DEFAULT, null)
      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, null, undefined)

      // Test undefined data
      await queueService.addJob(QueueName.DEFAULT, undefined)
      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, undefined, undefined)
    })

    it('should preserve job options immutability', async () => {
      const expectedResult = { id: 'job-immutable', queueName: QueueName.DEFAULT }
      const originalOptions: JobsOptions = {
        delay: 1000,
        attempts: 2,
      }
      const optionsCopy = { ...originalOptions }
      mockQueue.add.mockResolvedValue(expectedResult)

      await queueService.addJob(QueueName.DEFAULT, mockJobData, originalOptions)

      expect(mockQueue.add).toHaveBeenCalledWith(QueueName.DEFAULT, mockJobData, originalOptions)
      expect(originalOptions).toEqual(optionsCopy) // Ensure options weren't mutated
    })
  })

  describe('queue registry access', () => {
    it('should use the correct queue for each queue name', async () => {
      const defaultQueueMock = { add: jest.fn().mockResolvedValue({ id: 'default-job' }) }
      const deadLetterQueueMock = { add: jest.fn().mockResolvedValue({ id: 'dead-letter-job' }) }

      const separateQueueRegistry = {
        [QueueName.DEFAULT]: defaultQueueMock,
        [QueueName.DEAD_LETTER]: deadLetterQueueMock,
      }

      ;(queueService as any).queues = separateQueueRegistry

      // Test default queue
      await queueService.addJob(QueueName.DEFAULT, { test: 'data' })
      expect(defaultQueueMock.add).toHaveBeenCalledWith(QueueName.DEFAULT, { test: 'data' }, undefined)
      expect(deadLetterQueueMock.add).not.toHaveBeenCalled()

      // Reset mocks
      defaultQueueMock.add.mockClear()
      deadLetterQueueMock.add.mockClear()

      // Test dead letter queue
      await queueService.addJob(QueueName.DEAD_LETTER, { test: 'dead-letter-data' })
      expect(deadLetterQueueMock.add).toHaveBeenCalledWith(
        QueueName.DEAD_LETTER,
        { test: 'dead-letter-data' },
        undefined,
      )
      expect(defaultQueueMock.add).not.toHaveBeenCalled()
    })
  })
})
