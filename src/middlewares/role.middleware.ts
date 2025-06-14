import { Request, Response, NextFunction } from 'express'
import roleService from '../services/role.service'
import { createRoleSchema } from '../schemas/role/role.schema'
import BadRequestException from '../exceptions/BadRequestException'
import ConflictException from '../exceptions/ConflictException'
import { errorHandler } from '../handlers/errorHandler'

class RoleMiddleware {
  checkCreateRoleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createRoleSchema.validate(req.body)

    if (error) {
      return errorHandler(new BadRequestException(error.details[0].message), req, res, next)
    }

    next()
  }

  async verifyRoleExistance(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body
    const role = await roleService.findByName(name)

    if (role !== null) {
      return errorHandler(new ConflictException('Role already exists'), req, res, next)
    }

    next()
  }
}

export default new RoleMiddleware()
