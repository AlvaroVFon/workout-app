import { Request, Response, NextFunction } from 'express'
import { paginationSchema } from '../schemas/utils.schema'
import BadRequestException from '../exceptions/BadRequestException'
import { parameters } from '../config/parameters'

class PaginationMiddleware {
  paginate(req: Request, res: Response, next: NextFunction) {
    const { value, error } = paginationSchema.validate(req.query)

    if (error) return next(new BadRequestException(error.details[0].message))

    res.locals.pagination = {
      limit: value.limit < parameters.paginationMaxLimit ? Number(value.limit) : parameters.paginationMaxLimit,
      page: Number(value.page) || 1,
      paginate: value.paginate,
    }

    next()
  }
}

export default new PaginationMiddleware()
