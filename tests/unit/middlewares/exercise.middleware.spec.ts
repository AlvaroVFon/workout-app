import { Request, Response, NextFunction } from 'express'
import exerciseMiddleware from '../../../src/middlewares/exercise.middleware'
import { createExerciseSchema } from '../../../src/schemas/exercise/exercise.schema'
import { responseHandler } from '../../../src/handlers/responseHandler'
import { StatusCode } from '../../../src/utils/enums/httpResponses.enum'

jest.mock('../../../src/schemas/exercise/exercise.schema', () => ({
  createExerciseSchema: {
    validate: jest.fn(),
  },
}))

jest.mock('../../../src/handlers/responseHandler', () => ({
  responseHandler: jest.fn(),
}))

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

    expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.BAD_REQUEST, validationError.details[0].message)
    expect(next).not.toHaveBeenCalled()
  })
})
