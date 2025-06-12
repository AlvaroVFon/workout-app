import { Request, Response, NextFunction } from 'express'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import roleMiddleware from '../../../src/middlewares/role.middleware'
import { createRoleSchema } from '../../../src/schemas/role/role.schema'

jest.mock('../../../src/schemas/role/role.schema', () => ({
  createRoleSchema: {
    validate: jest.fn(),
  },
}))

describe('RoleMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
  })

  it('should call next if validation passes', () => {
    ;(createRoleSchema.validate as jest.Mock).mockReturnValue({ error: null })

    roleMiddleware.checkCreateRoleSchema(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })

  it('should throw BadRequestException if validation fails', () => {
    const errorMessage = 'Validation error'
    ;(createRoleSchema.validate as jest.Mock).mockReturnValue({
      error: { details: [{ message: errorMessage }] },
    })

    expect(() => roleMiddleware.checkCreateRoleSchema(req as Request, res as Response, next as NextFunction)).toThrow(
      BadRequestException,
    )

    expect(next).not.toHaveBeenCalled()
  })
})
