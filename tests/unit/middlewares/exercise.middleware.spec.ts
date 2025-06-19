import { Request, Response, NextFunction } from 'express'
import exerciseMiddleware from '../../../src/middlewares/exercise.middleware'
import { createExerciseSchema, updateExerciseSchema } from '../../../src/schemas/exercise/exercise.schema'
import { responseHandler } from '../../../src/handlers/responseHandler'
import exerciseService from '../../../src/services/exercise.service'
import ConflictException from '../../../src/exceptions/ConflictException'
import BadRequestException from '../../../src/exceptions/BadRequestException'

jest.mock('../../../src/schemas/exercise/exercise.schema', () => ({
  createExerciseSchema: {
    validate: jest.fn(),
  },
  updateExerciseSchema: {
    validate: jest.fn(),
  },
}))

jest.mock('../../../src/handlers/responseHandler', () => ({
  responseHandler: jest.fn(),
}))

jest.mock('../../../src/services/exercise.service')

describe('ExerciseMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('checkCreateExerciseSchema', () => {
    it('should call next if validation passes', () => {
      ;(createExerciseSchema.validate as jest.Mock).mockReturnValue({
        error: null,
      })

      exerciseMiddleware.checkCreateExerciseSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
      expect(responseHandler).not.toHaveBeenCalled()
    })

    it('should call responseHandler if validation fails', () => {
      const validationError = { details: [{ message: 'Invalid data' }] }
      ;(createExerciseSchema.validate as jest.Mock).mockReturnValue({
        error: validationError,
      })

      exerciseMiddleware.checkCreateExerciseSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException(validationError.details[0].message))
    })
  })

  describe('checkUpdateExerciseSchema', () => {
    it('should call next if validation passes', () => {
      ;(updateExerciseSchema.validate as jest.Mock).mockReturnValue({
        error: null,
      })

      exerciseMiddleware.checkUpdateExerciseSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
      expect(responseHandler).not.toHaveBeenCalled()
    })

    it('should call responseHandler if validation fails', () => {
      const validationError = { details: [{ message: 'Invalid data' }] }
      ;(updateExerciseSchema.validate as jest.Mock).mockReturnValue({
        error: validationError,
      })

      exerciseMiddleware.checkUpdateExerciseSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException(validationError.details[0].message))
    })
  })

  describe('validateExerciseExistence', () => {
    it('should call next if exercise does not exists', async () => {
      ;(exerciseService.findByName as jest.Mock).mockReturnValue(null)

      await exerciseMiddleware.validateExerciseExistence(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with ConflictException is exercise already exists', async () => {
      const mockExercise = {
        name: 'Front lever',
        description: 'cool movement',
      }
      ;(exerciseService.findByName as jest.Mock).mockReturnValue(mockExercise)

      await exerciseMiddleware.validateExerciseExistence(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new ConflictException('Exercise already exists'))
    })
  })
})
