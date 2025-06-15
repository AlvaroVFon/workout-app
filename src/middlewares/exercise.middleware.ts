import { Request, Response, NextFunction } from 'express'
import { createExerciseSchema } from '../schemas/exercise/exercise.schema'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode } from '../utils/enums/httpResponses.enum'

class ExerciseMiddleware {
  checkCreateExerciseSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createExerciseSchema.validate(req.body)

    if (error) return responseHandler(res, StatusCode.BAD_REQUEST, error.details[0].message)
    next()
  }
}

export default new ExerciseMiddleware()
