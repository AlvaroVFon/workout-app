import { Request, Response } from 'express'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import ConflictException from '../../../src/exceptions/ConflictException'
import roleMiddleware from '../../../src/middlewares/role.middleware'
import { createRoleSchema } from '../../../src/schemas/role/role.schema'
import roleService from '../../../src/services/role.service'

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

  describe('validateCreateRoleSchema', () => {
    it('should call next if validation passes', () => {
      ;(createRoleSchema.validate as jest.Mock).mockReturnValue({ error: null })

      roleMiddleware.validateCreateRoleSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
    })

    it('should call next with BadRequestException if validation fails', () => {
      const validationError = { details: [{ message: 'Invalid data' }] }
      ;(createRoleSchema.validate as jest.Mock).mockReturnValue({
        error: validationError,
      })

      roleMiddleware.validateCreateRoleSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException(validationError.details[0].message))
    })
  })

  describe('verifyRoleExistence', () => {
    it('should call next if role does not exist', async () => {
      ;(roleService.findByName as jest.Mock).mockReturnValue(null)

      req.body = { name: 'user' }

      await roleMiddleware.verifyRoleExistence(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
    })

    it('should call next with ConflictException if role already exists', async () => {
      const mockRole = { name: 'someRole' }
      ;(roleService.findByName as jest.Mock).mockResolvedValue(mockRole)

      await roleMiddleware.verifyRoleExistence(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new ConflictException('Role already exists'))
    })
  })
})
