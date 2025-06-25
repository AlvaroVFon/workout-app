import trainingSessionMiddleware from '../../../src/middlewares/trainingSession.middleware'
import { Request, Response, NextFunction } from 'express'
import {
  createTrainingSessionSchema,
  updateTrainingSessionSchema,
} from '../../../src/schemas/trainingSession/trainingSession.schema'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import { ObjectId } from 'mongodb'
import { TrainingTypeEnum } from '../../../src/utils/enums/trainingTypes.enum'

// Mock the schemas
jest.mock('../../../src/schemas/trainingSession/trainingSession.schema')

const mockCreateTrainingSessionSchema = createTrainingSessionSchema as jest.Mocked<typeof createTrainingSessionSchema>
const mockUpdateTrainingSessionSchema = updateTrainingSessionSchema as jest.Mocked<typeof updateTrainingSessionSchema>

describe('TrainingSession Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {},
    }
    mockResponse = {}
    mockNext = jest.fn()
    jest.clearAllMocks()
  })

  describe('checkCreateTrainingSessionSchema', () => {
    it('should validate valid training session data successfully', () => {
      const validTrainingSession = {
        athlete: new ObjectId(),
        date: new Date(),
        type: TrainingTypeEnum.STRENGTH,
        exercises: [
          {
            exercise: new ObjectId(),
            sets: [{ reps: 10, weight: 75, rir: 2 }],
          },
        ],
        notes: 'Great workout',
        week: 15,
        month: 4,
        year: 2024,
        tags: ['gym'],
      }

      const validatedData = { ...validTrainingSession }

      mockRequest.body = validTrainingSession
      mockCreateTrainingSessionSchema.validate.mockReturnValue({
        value: validatedData,
        error: undefined,
      } as never)

      trainingSessionMiddleware.checkCreateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockCreateTrainingSessionSchema.validate).toHaveBeenCalledWith(validTrainingSession)
      expect(mockRequest.body).toEqual(validatedData)
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should return BadRequestException for invalid data', () => {
      const invalidTrainingSession = {
        athlete: 'invalid-id',
        date: 'invalid-date',
        type: 'invalid-type',
      }

      const validationError = {
        details: [{ message: 'Invalid athlete ID format' }],
      }

      mockRequest.body = invalidTrainingSession
      mockCreateTrainingSessionSchema.validate.mockReturnValue({
        value: undefined,
        error: validationError,
      } as any)

      trainingSessionMiddleware.checkCreateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockCreateTrainingSessionSchema.validate).toHaveBeenCalledWith(invalidTrainingSession)
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestException))

      const calledError = (mockNext as jest.Mock).mock.calls[0][0]
      expect(calledError.message).toBe('Invalid athlete ID format')
    })

    it('should handle missing required fields', () => {
      const incompleteTrainingSession = {
        date: new Date(),
        type: TrainingTypeEnum.STRENGTH,
        // Missing athlete and exercises
      }

      const validationError = {
        details: [{ message: 'athlete is required' }],
      }

      mockRequest.body = incompleteTrainingSession
      mockCreateTrainingSessionSchema.validate.mockReturnValue({
        value: undefined,
        error: validationError,
      } as any)

      trainingSessionMiddleware.checkCreateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestException))

      const calledError = (mockNext as jest.Mock).mock.calls[0][0]
      expect(calledError.message).toBe('athlete is required')
    })

    it('should handle validation exceptions', () => {
      const validTrainingSession = {
        athlete: new ObjectId(),
        date: new Date(),
        type: TrainingTypeEnum.STRENGTH,
        exercises: [],
      }

      const thrownError = new Error('Validation failed')
      mockRequest.body = validTrainingSession
      mockCreateTrainingSessionSchema.validate.mockImplementation(() => {
        throw thrownError
      })

      trainingSessionMiddleware.checkCreateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalledWith(thrownError)
    })

    it('should handle empty request body', () => {
      const validationError = {
        details: [{ message: 'body is required' }],
      }

      mockRequest.body = {}
      mockCreateTrainingSessionSchema.validate.mockReturnValue({
        value: undefined,
        error: validationError,
      } as any)

      trainingSessionMiddleware.checkCreateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestException))
    })
  })

  describe('checkUpdateTrainingSessionSchema', () => {
    it('should validate valid update data successfully', () => {
      const validUpdateData = {
        notes: 'Updated workout notes',
        type: TrainingTypeEnum.ENDURANCE,
        tags: ['outdoor', 'running'],
      }

      mockRequest.body = validUpdateData
      mockUpdateTrainingSessionSchema.validate.mockReturnValue({
        value: validUpdateData,
        error: undefined,
      } as any)

      trainingSessionMiddleware.checkUpdateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockUpdateTrainingSessionSchema.validate).toHaveBeenCalledWith(validUpdateData)
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should return BadRequestException for invalid update data', () => {
      const invalidUpdateData = {
        type: 'invalid-type',
        week: 'invalid-week',
        month: 'invalid-month',
      }

      const validationError = {
        details: [{ message: 'Invalid training type' }],
      }

      mockRequest.body = invalidUpdateData
      mockUpdateTrainingSessionSchema.validate.mockReturnValue({
        value: undefined,
        error: validationError,
      } as any)

      trainingSessionMiddleware.checkUpdateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockUpdateTrainingSessionSchema.validate).toHaveBeenCalledWith(invalidUpdateData)
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestException))

      const calledError = (mockNext as jest.Mock).mock.calls[0][0]
      expect(calledError.message).toBe('Invalid training type')
    })

    it('should handle validation exceptions in update', () => {
      const validUpdateData = {
        notes: 'Updated notes',
      }

      const thrownError = new Error('Update validation failed')
      mockRequest.body = validUpdateData
      mockUpdateTrainingSessionSchema.validate.mockImplementation(() => {
        throw thrownError
      })

      trainingSessionMiddleware.checkUpdateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalledWith(thrownError)
    })

    it('should handle empty update body', () => {
      mockRequest.body = {}
      mockUpdateTrainingSessionSchema.validate.mockReturnValue({
        value: {},
        error: undefined,
      } as any)

      trainingSessionMiddleware.checkUpdateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockUpdateTrainingSessionSchema.validate).toHaveBeenCalledWith({})
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should validate partial update data', () => {
      const partialUpdateData = {
        notes: 'Only updating notes',
      }

      mockRequest.body = partialUpdateData
      mockUpdateTrainingSessionSchema.validate.mockReturnValue({
        value: partialUpdateData,
        error: undefined,
      } as any)

      trainingSessionMiddleware.checkUpdateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockUpdateTrainingSessionSchema.validate).toHaveBeenCalledWith(partialUpdateData)
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should handle multiple validation errors', () => {
      const invalidUpdateData = {
        type: 'invalid',
        week: -1,
        month: 13,
        year: 1999,
      }

      const validationError = {
        details: [{ message: 'Multiple validation errors occurred' }],
      }

      mockRequest.body = invalidUpdateData
      mockUpdateTrainingSessionSchema.validate.mockReturnValue({
        value: undefined,
        error: validationError,
      } as any)

      trainingSessionMiddleware.checkUpdateTrainingSessionSchema(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestException))

      const calledError = (mockNext as jest.Mock).mock.calls[0][0]
      expect(calledError.message).toBe('Multiple validation errors occurred')
    })
  })
})
