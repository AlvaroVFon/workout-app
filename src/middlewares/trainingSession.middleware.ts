import { Request, Response, NextFunction } from 'express'
import {
  createTrainingSessionSchema,
  updateTrainingSessionSchema,
} from '../schemas/trainingSession/trainingSession.schema'
import BadRequestException from '../exceptions/BadRequestException'

class TrainingSessionMiddleware {
  validateCreateTrainingSessionSchema(req: Request, res: Response, next: NextFunction) {
    try {
      const { value, error } = createTrainingSessionSchema.validate(req.body)
      if (error) return next(new BadRequestException(error.details[0].message))

      req.body = value
      next()
    } catch (error) {
      next(error)
    }
  }

  validateUpdateTrainingSessionSchema(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = updateTrainingSessionSchema.validate(req.body)
      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new TrainingSessionMiddleware()
