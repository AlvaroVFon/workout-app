import { Request, Response } from 'express'
import paginationMiddleware from '../../../src/middlewares/pagination.middleware'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import { parameters } from '../../../src/config/parameters'

describe('paginationMiddleware.paginate middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { query: {} }
    res = { locals: {} }
    next = jest.fn()
  })

  it('should set default pagination values if none are provided', () => {
    paginationMiddleware.paginate(req as Request, res as Response, next)

    expect(res.locals?.pagination).toEqual({
      limit: 20,
      page: 1,
      paginate: false,
    })
    expect(next).toHaveBeenCalled()
  })

  it('should set pagination values from query parameters', () => {
    req.query = { limit: '10', page: '2', paginate: 'true' }

    paginationMiddleware.paginate(req as Request, res as Response, next)

    expect(res.locals?.pagination).toEqual({
      limit: 10,
      page: 2,
      paginate: true,
    })
    expect(next).toHaveBeenCalled()
  })

  it('should call next with BadRequestException if validation fails', () => {
    req.query = { limit: 'invalid' }

    paginationMiddleware.paginate(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestException))
  })

  it('should set maxLimit if limit exceeds the maximum allowed', () => {
    req.query = { limit: '1000', page: '1', paginate: 'true' }

    paginationMiddleware.paginate(req as Request, res as Response, next)

    expect(res.locals?.pagination).toEqual({
      limit: parameters.maxLimit,
      page: 1,
      paginate: true,
    })
  })
})
