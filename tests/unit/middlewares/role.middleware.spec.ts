import { Request, Response, NextFunction } from 'express'
import roleMiddleware from '../../../src/middlewares/role.middleware'
import roleService from '../../../src/services/role.service'
import { createRoleSchema } from '../../../src/schemas/role/role.schema'

jest.mock('../../../src/schemas/role/role.schema', () => ({
  createRoleSchema: {
    validate: jest.fn(),
  },
}))

jest.mock('../../../src/services/role.service', () => {
  return {
    findByName: jest.fn(),
  }
})

describe('RoleMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {} }
    res = { status: jest.fn(), json: jest.fn() }
    next = jest.fn()
  })

  it('should call next if validation passes', () => {
    ;(createRoleSchema.validate as jest.Mock).mockReturnValue({ error: null })

    roleMiddleware.checkCreateRoleSchema(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })

  it('should call next if role does not exist', async () => {
    ;(roleService.findByName as jest.Mock).mockReturnValue(null)

    req.body = { name: 'user' }

    await roleMiddleware.verifyRoleExistance(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })
})
