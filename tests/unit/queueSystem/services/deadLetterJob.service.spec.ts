import { Job } from 'bullmq'
import { DeadLetterDTO } from '../../../../src/queueSystem/deadLetterJob.dto'
import deadLetterJobRepository from '../../../../src/queueSystem/repositories/deadLetterJob.repository'
import deadLetterJobService from '../../../../src/queueSystem/services/deadLetterJob.service'
import { QueueName } from '../../../../src/queueSystem/utils/queue.enum'
import { JobEnum } from '../../../../src/utils/enums/jobs/jobs.enum'

jest.mock('../../../../src/queueSystem/repositories/deadLetterJob.repository')

describe('DeadLetterJobService', () => {
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
      ;(deadLetterJobRepository.create as jest.Mock).mockResolvedValue(mockDeadLetterJob)

      const result = await deadLetterJobService.create(mockBullMQJob as Job)

      expect(deadLetterJobRepository.create).toHaveBeenCalledWith(mockBullMQJob)
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should throw error when repository throws error', async () => {
      const error = new Error('Repository error')
      ;(deadLetterJobRepository.create as jest.Mock).mockRejectedValue(error)

      await expect(deadLetterJobService.create(mockBullMQJob as Job)).rejects.toThrow(error)
      expect(deadLetterJobRepository.create).toHaveBeenCalledWith(mockBullMQJob)
    })
  })

  describe('findOne', () => {
    it('should find one dead letter job with query', async () => {
      const query = { jobId: 'job-123' }
      ;(deadLetterJobRepository.findOne as jest.Mock).mockResolvedValue(mockDeadLetterJob)

      const result = await deadLetterJobService.findOne({ query })

      expect(deadLetterJobRepository.findOne).toHaveBeenCalledWith({
        query,
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should find one dead letter job with query, projection and options', async () => {
      const query = { queueName: QueueName.DEFAULT }
      const projection = { jobId: 1, queueName: 1 }
      const options = { sort: { createdAt: -1 } }
      ;(deadLetterJobRepository.findOne as jest.Mock).mockResolvedValue(mockDeadLetterJob)

      const result = await deadLetterJobService.findOne({ query, projection, options })

      expect(deadLetterJobRepository.findOne).toHaveBeenCalledWith({
        query,
        projection,
        options,
      })
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should use default empty parameters when not provided', async () => {
      ;(deadLetterJobRepository.findOne as jest.Mock).mockResolvedValue(mockDeadLetterJob)

      const result = await deadLetterJobService.findOne({})

      expect(deadLetterJobRepository.findOne).toHaveBeenCalledWith({
        query: {},
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockDeadLetterJob)
    })
  })

  describe('findAll', () => {
    const mockDeadLetterJobs = [mockDeadLetterJob, { ...mockDeadLetterJob, jobId: 'job-456' }]

    it('should find all dead letter jobs with query', async () => {
      const query = { queueName: QueueName.DEFAULT }
      ;(deadLetterJobRepository.findAll as jest.Mock).mockResolvedValue(mockDeadLetterJobs)

      const result = await deadLetterJobService.findAll({ query })

      expect(deadLetterJobRepository.findAll).toHaveBeenCalledWith({
        query,
        projection: {},
        options: {},
      })
      expect(result).toEqual(mockDeadLetterJobs)
    })

    it('should find all dead letter jobs with query, projection and options', async () => {
      const query = { jobType: JobEnum.EMAIL }
      const projection = { jobId: 1, createdAt: 1 }
      const options = { sort: { createdAt: -1 }, limit: 10 }
      ;(deadLetterJobRepository.findAll as jest.Mock).mockResolvedValue(mockDeadLetterJobs)

      const result = await deadLetterJobService.findAll({ query, projection, options })

      expect(deadLetterJobRepository.findAll).toHaveBeenCalledWith({
        query,
        projection,
        options,
      })
      expect(result).toEqual(mockDeadLetterJobs)
    })

    it('should use default empty parameters when not provided', async () => {
      ;(deadLetterJobRepository.findAll as jest.Mock).mockResolvedValue(mockDeadLetterJobs)

      const result = await deadLetterJobService.findAll({})

      expect(deadLetterJobRepository.findAll).toHaveBeenCalledWith({
        query: {},
        projection: {},
        options: {},
      })
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
      ;(deadLetterJobRepository.update as jest.Mock).mockResolvedValue(updatedJob)

      const result = await deadLetterJobService.update(query, updateData)

      expect(deadLetterJobRepository.update).toHaveBeenCalledWith(query, updateData)
      expect(result).toEqual(updatedJob)
    })

    it('should return null when job not found for update', async () => {
      const query = { jobId: 'non-existent' }
      const updateData: Partial<DeadLetterDTO> = {
        jobType: JobEnum.EMAIL,
      }
      ;(deadLetterJobRepository.update as jest.Mock).mockResolvedValue(null)

      const result = await deadLetterJobService.update(query, updateData)

      expect(deadLetterJobRepository.update).toHaveBeenCalledWith(query, updateData)
      expect(result).toBeNull()
    })

    it('should throw error when repository throws error', async () => {
      const query = { jobId: 'job-123' }
      const updateData: Partial<DeadLetterDTO> = { jobType: JobEnum.EMAIL }
      const error = new Error('Repository error')
      ;(deadLetterJobRepository.update as jest.Mock).mockRejectedValue(error)

      await expect(deadLetterJobService.update(query, updateData)).rejects.toThrow(error)
      expect(deadLetterJobRepository.update).toHaveBeenCalledWith(query, updateData)
    })
  })

  describe('delete', () => {
    it('should delete a dead letter job', async () => {
      const query = { jobId: 'job-123' }
      ;(deadLetterJobRepository.delete as jest.Mock).mockResolvedValue(mockDeadLetterJob)

      const result = await deadLetterJobService.delete(query)

      expect(deadLetterJobRepository.delete).toHaveBeenCalledWith(query)
      expect(result).toEqual(mockDeadLetterJob)
    })

    it('should return null when job not found for deletion', async () => {
      const query = { jobId: 'non-existent' }
      ;(deadLetterJobRepository.delete as jest.Mock).mockResolvedValue(null)

      const result = await deadLetterJobService.delete(query)

      expect(deadLetterJobRepository.delete).toHaveBeenCalledWith(query)
      expect(result).toBeNull()
    })

    it('should throw error when repository throws error', async () => {
      const query = { jobId: 'job-123' }
      const error = new Error('Repository error')
      ;(deadLetterJobRepository.delete as jest.Mock).mockRejectedValue(error)

      await expect(deadLetterJobService.delete(query)).rejects.toThrow(error)
      expect(deadLetterJobRepository.delete).toHaveBeenCalledWith(query)
    })
  })
})
