import { Request, Response, NextFunction } from 'express'
import { createMuscleSchema } from '../schemas/muscle/muscle.schema'
import { errorHandler } from '../handlers/errorHandler'
import BadRequestException from '../exceptions/BadRequestException'

class MuscleMiddleware {
  checkCreateMuscleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createMuscleSchema.validate(req.body)

    if (error) return errorHandler(new BadRequestException(error.details[0].message), req, res, next)

    next()
  }
}

export default new MuscleMiddleware()
