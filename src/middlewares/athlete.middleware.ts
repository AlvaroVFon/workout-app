import { Request, Response, NextFunction } from 'express'
import { createAthleteSchema, updateAthleteSchema } from '../schemas/athlete/athlete.schema'
import athleteService from '../services/athlete.service'
import ConflictException from '../exceptions/ConflictException'
import BadRequestException from '../exceptions/BadRequestException'

class AthleteMiddleware {
  checkCreateAthleteSchema(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = createAthleteSchema.validate(req.body)
      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  checkUpdateAthleteSchema(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = updateAthleteSchema.validate(req.body)
      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateAthleteExistence(req: Request, res: Response, next: NextFunction) {
    try {
      const query = { idDocument: req.body.idDocument }
      const athlete = await athleteService.findOne({ query })

      if (athlete) return next(new ConflictException(`Athlete with idDocument: ${req.body.idDocument} already exists`))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new AthleteMiddleware()
