import { Request, Response, NextFunction } from 'express'
import roleService from '../services/role.service'
import { createRoleSchema } from '../schemas/role/role.schema'
import BadRequestException from '../exceptions/BadRequestException'
import ConflictException from '../exceptions/ConflictException'

class RoleMiddleware {
  checkCreateRoleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createRoleSchema.validate(req.body)

    if (error) next(new BadRequestException(error.details[0].message))

    next()
  }

  async verifyRoleExistance(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body
    const role = await roleService.findByName(name)

    if (role !== null) {
      next(new ConflictException('Role already exists'))
    }

    next()
  }
}

export default new RoleMiddleware()
