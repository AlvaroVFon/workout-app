import { Request, Response, NextFunction } from 'express'
import { createAthleteSchema, updateAthleteSchema } from '../schemas/athlete/athlete.schema'
import athleteService from '../services/athlete.service'
import ConflictException from '../exceptions/ConflictException'
import BadRequestException from '../exceptions/BadRequestException'
import { AuthenticatedUser } from '../interfaces/user.inteface'
import ForbiddenException from '../exceptions/ForbiddenException'

class AthleteMiddleware {
  validateCreateAthleteSchema(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = createAthleteSchema.validate(req.body)
      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  validateUpdateAthleteSchema(req: Request, res: Response, next: NextFunction) {
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

  async validateAthleteOwnership(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const coach = req.user as AuthenticatedUser
      const athlete = await athleteService.findOne({ query: { _id: id } })

      if (athlete?.coach.toString() !== coach.id.toString()) return next(new ForbiddenException())

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new AthleteMiddleware()
