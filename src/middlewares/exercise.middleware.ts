import { Request, Response, NextFunction } from 'express'
import { createExerciseSchema, updateExerciseSchema } from '../schemas/exercise/exercise.schema'
import exerciseService from '../services/exercise.service'
import ConflictException from '../exceptions/ConflictException'
import BadRequestException from '../exceptions/BadRequestException'

class ExerciseMiddleware {
  validateCreateExerciseSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createExerciseSchema.validate(req.body)

    if (error) return next(new BadRequestException(error.details[0].message))

    next()
  }

  validateUpdateExerciseSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = updateExerciseSchema.validate(req.body)

    if (error) return next(new BadRequestException(error.details[0].message))

    next()
  }

  async validateExerciseExistence(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body

    try {
      const exercise = await exerciseService.findByName(name)
      if (exercise) return next(new ConflictException('Exercise already exists'))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new ExerciseMiddleware()
