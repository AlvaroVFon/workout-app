import { Request, Response, NextFunction } from 'express'
import { createMuscleSchema } from '../schemas/muscle/muscle.schema'
import BadRequestException from '../exceptions/BadRequestException'

class MuscleMiddleware {
  checkCreateMuscleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createMuscleSchema.validate(req.body)

    if (error) next(new BadRequestException(error.details[0].message))

    next()
  }
}

export default new MuscleMiddleware()
