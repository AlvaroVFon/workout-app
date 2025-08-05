import { NextFunction, Request, Response } from 'express'
import BadRequestException from '../exceptions/BadRequestException'
import { createDisciplineSchema, updateDisciplineSchema } from '../schemas/discipline/discipline.schema'
import disciplineService from '../services/discipline.service'

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

  async validateDisciplinesExistence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { disciplines } = req.body

      for (const diciplineId of disciplines) {
        const discipline = await disciplineService.findById(diciplineId)
        if (!discipline) {
          return next(new BadRequestException(`Discipline with ID ${diciplineId} does not exist`))
        }
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new DisciplineMiddleware()
