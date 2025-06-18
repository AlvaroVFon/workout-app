import { Request, Response, NextFunction } from 'express'
import { createExerciseSchema, updateExerciseSchema } from '../schemas/exercise/exercise.schema'
import exerciseService from '../services/exercise.service'
import ConflictException from '../exceptions/ConflictException'

class ExerciseMiddleware {
  checkCreateExerciseSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createExerciseSchema.validate(req.body)

    if (error) next(error.details[0].message)

    next()
  }

  checkUpdateExerciseSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = updateExerciseSchema.validate(req.body)

    if (error) next(error?.details[0].message)

    next()
  }

  async verifyExerciseExistance(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body

    try {
      const exercise = await exerciseService.findByName(name)
      if (exercise) next(new ConflictException('Exercise already exists'))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new ExerciseMiddleware()
