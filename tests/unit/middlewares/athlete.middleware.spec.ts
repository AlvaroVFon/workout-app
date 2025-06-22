import { Request, Response, NextFunction } from 'express'
import athleteMiddleware from '../../../src/middlewares/athlete.middleware'
import athleteService from '../../../src/services/athlete.service'
import ConflictException from '../../../src/exceptions/ConflictException'
import BadRequestException from '../../../src/exceptions/BadRequestException'

jest.mock('../../../src/services/athlete.service')

describe('athlete.middleware', () => {
  let req: Partial<Request>, res: Partial<Response>, next: jest.Mock

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('checkCreateAthleteSchema', () => {
    it('should call next with no error for valid body', () => {
      req.body = {
        email: 'athlete@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        idDocument: 'ID123',
      }
      athleteMiddleware.checkCreateAthleteSchema(req as Request, res as Response, next)
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with BadRequestException for invalid body', () => {
      req.body = { firstname: 'Jane' }
      athleteMiddleware.checkCreateAthleteSchema(req as Request, res as Response, next)
      expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestException)
    })
  })

  describe('checkUpdateAthleteSchema', () => {
    it('should call next with no error for valid update', () => {
      req.body = { firstname: 'Updated' }
      athleteMiddleware.checkUpdateAthleteSchema(req as Request, res as Response, next)
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with BadRequestException for invalid update', () => {
      req.body = { height: 0 }
      athleteMiddleware.checkUpdateAthleteSchema(req as Request, res as Response, next)
      expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestException)
    })
  })

  describe('validateAthleteExistence', () => {
    it('should call next with ConflictException if athlete exists', async () => {
      ;(athleteService.findOne as jest.Mock).mockResolvedValue({})
      req.body.idDocument = 'ID123'
      await athleteMiddleware.validateAthleteExistence(req as Request, res as Response, next)
      expect(next.mock.calls[0][0]).toBeInstanceOf(ConflictException)
    })

    it('should call next with no error if athlete does not exist', async () => {
      ;(athleteService.findOne as jest.Mock).mockResolvedValue(null)
      req.body.idDocument = 'ID123'
      await athleteMiddleware.validateAthleteExistence(req as Request, res as Response, next)
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with error if service throws', async () => {
      const error = new Error('fail')
      ;(athleteService.findOne as jest.Mock).mockRejectedValue(error)
      req.body.idDocument = 'ID123'
      await athleteMiddleware.validateAthleteExistence(req as Request, res as Response, next)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
