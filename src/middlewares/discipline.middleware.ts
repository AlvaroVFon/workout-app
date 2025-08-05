import { NextFunction, Request, Response } from 'express'
import BadRequestException from '../exceptions/BadRequestException'
import { createDisciplineSchema, updateDisciplineSchema } from '../schemas/discipline/discipline.schema'

class DisciplineMiddleware {
  async validateCreateDiscipline(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { error } = createDisciplineSchema.validate(req.body)
    if (error) next(new BadRequestException(error.details[0].message))
    next()
  }

  async validateUpdateDiscipline(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { error } = updateDisciplineSchema.validate(req.body)
    if (error) next(new BadRequestException(error.details[0].message))
    next()
  }
}

export default new DisciplineMiddleware()
