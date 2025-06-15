import { Request, Response, NextFunction } from 'express'
import { createMuscleSchema } from '../schemas/muscle/muscle.schema'
import { errorHandler } from '../handlers/errorHandler'
import BadRequestException from '../exceptions/BadRequestException'
import muscleRepository from '../repositories/muscle.repository'

class MuscleMiddleware {
  checkCreateMuscleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createMuscleSchema.validate(req.body)

    if (error) return errorHandler(new BadRequestException(error.details[0].message), req, res, next)

    next()
  }

  async checkMusclesExistance(req: Request, res: Response, next: NextFunction) {
    try {
      const { muscles } = req.body.muscles
      console.log(muscles)

      const dbMuscles = await muscleRepository.findAll({ name: 1 })
      console.log(dbMuscles)
      next()
    } catch (error) {
      console.log(error)
    }

    next()
  }
}

export default new MuscleMiddleware()
