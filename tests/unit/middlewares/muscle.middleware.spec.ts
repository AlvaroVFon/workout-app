import { Request, Response, NextFunction } from 'express'
import muscleMiddleware from '../../../src/middlewares/muscle.middleware'
import { createMuscleSchema } from '../../../src/schemas/muscle/muscle.schema'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import { errorHandler } from '../../../src/handlers/errorHandler'

jest.mock('../../../src/schemas/muscle/muscle.schema', () => ({
  createMuscleSchema: {
    validate: jest.fn(),
  },
}))

jest.mock('../../../src/handlers/errorHandler', () => ({
  errorHandler: jest.fn(),
}))

describe('MuscleMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should call next if validation passes', () => {
    ;(createMuscleSchema.validate as jest.Mock).mockReturnValue({ error: null })

    muscleMiddleware.checkCreateMuscleSchema(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(errorHandler).not.toHaveBeenCalled()
  })

  it('should call errorHandler if validation fails', () => {
    const validationError = { details: [{ message: 'Invalid data' }] }
    ;(createMuscleSchema.validate as jest.Mock).mockReturnValue({
      error: validationError,
    })

    muscleMiddleware.checkCreateMuscleSchema(req as Request, res as Response, next)

    expect(errorHandler).toHaveBeenCalledWith(
      new BadRequestException(validationError.details[0].message),
      req,
      res,
      next,
    )
    expect(next).not.toHaveBeenCalled()
  })
})
