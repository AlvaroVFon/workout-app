import { Request, Response, NextFunction } from 'express'
import { objectIdSchema } from '../schemas/utils.schema'
import BadRequestException from '../exceptions/BadRequestException'

class GlobalValidatorMiddleware {
  async validateObjectId(req: Request, res: Response, next: NextFunction) {
    const objectId = req.params.id

    try {
      const { error } = objectIdSchema.validate(objectId)

      if (error) next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new GlobalValidatorMiddleware()
