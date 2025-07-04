import { NextFunction, Request, Response } from 'express'
import BadRequestException from '../exceptions/BadRequestException'
import ConflictException from '../exceptions/ConflictException'
import { createRoleSchema } from '../schemas/role/role.schema'
import roleService from '../services/role.service'

class RoleMiddleware {
  validateCreateRoleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createRoleSchema.validate(req.body)

    if (error) return next(new BadRequestException(error.details[0].message))

    next()
  }

  async verifyRoleExistence(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body
    const role = await roleService.findByName(name)

    if (role !== null) {
      return next(new ConflictException('Role already exists'))
    }

    next()
  }
}

export default new RoleMiddleware()
