import { Request, Response, NextFunction } from 'express'
import { objectIdSchema } from '../../../src/schemas/utils.schema'
import globalValidatorMiddleware from '../../../src/middlewares/globalValidator.middleware'
import BadRequestException from '../../../src/exceptions/BadRequestException'

jest.mock('../../../src/schemas/utils.schema')

describe('UserMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = {}
    next = jest.fn()
  })

  describe('validateObjectId', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      req.params = { id: 'invalid-id' }
      ;(objectIdSchema.validate as jest.Mock).mockReturnValue({
        error: { details: [{ message: 'Invalid ID' }] },
      })

      await globalValidatorMiddleware.validateObjectId(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestException))
    })

    it('should call next without error if validation passes', async () => {
      req.params = { id: 'valid-id' }
      ;(objectIdSchema.validate as jest.Mock).mockReturnValue({})

      await globalValidatorMiddleware.validateObjectId(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })
})
