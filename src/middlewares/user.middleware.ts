import { Request, Response, NextFunction } from 'express'
import { createUserSchema, updateUserSchema } from '../schemas/user/user.schema'
import userService from '../services/user.service'
import ConflictException from '../exceptions/ConflictException'
import { objectIdSchema } from '../schemas/utils.schema'
import BadRequestException from '../exceptions/BadRequestException'

class UserMiddleware {
  async validateUserExistence(req: Request, res: Response, next: NextFunction) {
    const data = req.body
    try {
      const user = await userService.getByEmail(data.email)

      if (user) {
        throw new ConflictException()
      }
    } catch (error) {
      next(error)
    }

    next()
  }

  async validateCreateUserSchemas(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      const { error } = createUserSchema.validate(data)

      if (error) throw new BadRequestException(error.details[0].message)

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateUpdateUserSchemas(req: Request, res: Response, next: NextFunction) {
    const data = req.body

    try {
      const { error } = updateUserSchema.validate(data)

      if (error) throw new BadRequestException(error.details[0].message)

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateObjectId(req: Request, res: Response, next: NextFunction) {
    const objectId = req.params.id

    try {
      const { error } = objectIdSchema.validate(objectId)

      if (error) throw new BadRequestException(error.details[0].message)

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserMiddleware()
