import { Request, Response, NextFunction } from 'express'
import { objectIdSchema } from '../schemas/utils.schema'
import BadRequestException from '../exceptions/BadRequestException'
import { codeSchema } from '../schemas/code/code.schema'

class GlobalValidatorMiddleware {
  async validateObjectId(req: Request, res: Response, next: NextFunction) {
    const objectId = req.params.id

    try {
      const { error } = objectIdSchema.validate(objectId)

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateCode(req: Request, res: Response, next: NextFunction) {
    const { code } = req.body

    try {
      const { error } = codeSchema.validate(code)

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new GlobalValidatorMiddleware()
