import { Job } from 'bullmq'
import { DeadLetterDTO } from '../../../../src/queueSystem/deadLetterJob.dto'
import deadLetterJob from '../../../../src/queueSystem/models/DeadLetter'
import deadLetterJobRepository from '../../../../src/queueSystem/repositories/deadLetterJob.repository'
import { QueueName } from '../../../../src/queueSystem/utils/queue.enum'
import { JobEnum } from '../../../../src/utils/enums/jobs/jobs.enum'
import logger from '../../../../src/utils/logger'

jest.mock('../../../../src/queueSystem/models/DeadLetter')
jest.mock('../../../../src/utils/logger')

describe('DeadLetterJobRepository', () => {
  const mockDeadLetterJob: DeadLetterDTO = {
    jobId: 'job-123',
    queueName: QueueName.DEFAULT,
    jobData: { email: 'test@example.com', code: '123456' },
    jobType: JobEnum.EMAIL,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
  }

  const mockBullMQJob: Partial<Job> = {
    id: 'job-123',
    queueName: QueueName.DEFAULT,
    data: { email: 'test@example.com', code: '123456' },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a dead letter job', async () => {
      ;(deadLetterJob.create as jest.Mock).mockResolvedValue(mockDeadLetterJob)

      const result = await deadLetterJobRepository.create(mockBullMQJob as Job)

      expect(deadLetterJob.create).toHaveBeenCalledWith({
        jobId: mockBullMQJob.id,
        queueName: mockBullMQJob.queueName,
        jobData: mockBullMQJob.data,
      })
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should log and throw error when creation fails', async () => {
      const error = new Error('Database error')
      ;(deadLetterJob.create as jest.Mock).mockRejectedValue(error)

      await expect(deadLetterJobRepository.create(mockBullMQJob as Job)).rejects.toThrow(error)

      expect(logger.error).toHaveBeenCalledWith('❌ Database save error:', error)
      expect(deadLetterJob.create).toHaveBeenCalledWith({
        jobId: mockBullMQJob.id,
        queueName: mockBullMQJob.queueName,
        jobData: mockBullMQJob.data,
      })
    })
  })

  describe('findOne', () => {
    it('should find one dead letter job by query', async () => {
      const query = { jobId: 'job-123' }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJob),
      }
      ;(deadLetterJob.findOne as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.findOne({ query })

      expect(deadLetterJob.findOne).toHaveBeenCalledWith(query, {}, {})
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should find one dead letter job with projection and options', async () => {
      const query = { queueName: QueueName.DEFAULT }
      const projection = { jobId: 1, queueName: 1 }
      const options = { sort: { createdAt: -1 } }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJob),
      }
      ;(deadLetterJob.findOne as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.findOne({ query, projection, options })

      expect(deadLetterJob.findOne).toHaveBeenCalledWith(query, projection, options)
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should use default empty parameters when not provided', async () => {
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJob),
      }
      ;(deadLetterJob.findOne as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.findOne({})

      expect(deadLetterJob.findOne).toHaveBeenCalledWith({}, {}, {})
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJob)
    })
  })

  describe('findAll', () => {
    const mockDeadLetterJobs = [mockDeadLetterJob, { ...mockDeadLetterJob, jobId: 'job-456' }]

    it('should find all dead letter jobs by query', async () => {
      const query = { queueName: QueueName.DEFAULT }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJobs),
      }
      ;(deadLetterJob.find as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.findAll({ query })

      expect(deadLetterJob.find).toHaveBeenCalledWith(query, {}, {})
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJobs)
    })

    it('should find all dead letter jobs with projection and options', async () => {
      const query = { jobType: JobEnum.EMAIL }
      const projection = { jobId: 1, createdAt: 1 }
      const options = { sort: { createdAt: -1 }, limit: 10 }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJobs),
      }
      ;(deadLetterJob.find as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.findAll({ query, projection, options })

      expect(deadLetterJob.find).toHaveBeenCalledWith(query, projection, options)
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJobs)
    })

    it('should use default empty parameters when not provided', async () => {
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJobs),
      }
      ;(deadLetterJob.find as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.findAll({})

      expect(deadLetterJob.find).toHaveBeenCalledWith({}, {}, {})
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJobs)
    })
  })

  describe('update', () => {
    it('should update a dead letter job', async () => {
      const query = { jobId: 'job-123' }
      const updateData: Partial<DeadLetterDTO> = {
        jobType: JobEnum.EMAIL,
      }
      const updatedJob = { ...mockDeadLetterJob, ...updateData }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(updatedJob),
      }
      ;(deadLetterJob.findOneAndUpdate as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.update(query, updateData)

      expect(deadLetterJob.findOneAndUpdate).toHaveBeenCalledWith(query, updateData, { new: true })
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(updatedJob)
    })

    it('should return null when job not found for update', async () => {
      const query = { jobId: 'non-existent' }
      const updateData: Partial<DeadLetterDTO> = {
        jobType: JobEnum.EMAIL,
      }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(deadLetterJob.findOneAndUpdate as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.update(query, updateData)

      expect(deadLetterJob.findOneAndUpdate).toHaveBeenCalledWith(query, updateData, { new: true })
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete a dead letter job', async () => {
      const query = { jobId: 'job-123' }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(mockDeadLetterJob),
      }
      ;(deadLetterJob.findOneAndDelete as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.delete(query)

      expect(deadLetterJob.findOneAndDelete).toHaveBeenCalledWith(query)
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should return null when job not found for deletion', async () => {
      const query = { jobId: 'non-existent' }
      const mockChain = {
        exec: jest.fn().mockResolvedValue(null),
      }
      ;(deadLetterJob.findOneAndDelete as jest.Mock).mockReturnValue(mockChain)

      const result = await deadLetterJobRepository.delete(query)

      expect(deadLetterJob.findOneAndDelete).toHaveBeenCalledWith(query)
      expect(mockChain.exec).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })
})
