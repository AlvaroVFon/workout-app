import { Request, Response, NextFunction } from 'express'
import { createRoleSchema } from '../schemas/role/role.schema'
import BadRequestException from '../exceptions/BadRequestException'

class RoleMiddleware {
  checkCreateRoleSchema(req: Request, res: Response, next: NextFunction) {
    const { error } = createRoleSchema.validate(req.body)

    if (error) throw new BadRequestException(error.details[0].message)

    next()
  }
}

export default new RoleMiddleware()
