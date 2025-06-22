import { Request, Response, NextFunction } from 'express'
import athleteController from '../../../src/controllers/athlete.controller'
import athleteService from '../../../src/services/athlete.service'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'
import * as responseHandlerModule from '../../../src/handlers/responseHandler'

jest.mock('../../../src/services/athlete.service')

describe('AthleteController (unit)', () => {
  let req: Partial<Request>, res: Partial<Response>, next: NextFunction
  const mockUser = { id: 'coachId' }
  const mockAthlete = {
    _id: 'athleteId',
    firstname: 'Jane',
    lastname: 'Doe',
    coach: 'coachId',
    email: 'athlete@example.com',
    idDocument: 'ID456',
  }

  beforeEach(() => {
    req = { body: {}, params: {}, user: mockUser }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: { pagination: { page: 1, limit: 10 } },
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should create an athlete and return 201', async () => {
    req.body = { firstname: 'Jane', lastname: 'Doe', email: 'athlete@example.com', idDocument: 'ID456' }
    ;(athleteService.create as jest.Mock).mockResolvedValue(mockAthlete)
    const responseHandlerSpy = jest.spyOn(responseHandlerModule, 'responseHandler')
    await athleteController.create(req as Request, res as Response, next)
    expect(athleteService.create).toHaveBeenCalledWith(req.body, mockUser.id)
    expect(responseHandlerSpy).toHaveBeenCalledWith(res, StatusCode.CREATED, StatusMessage.CREATED, mockAthlete)
  })

  it('should call next with error if service throws in create', async () => {
    const error = new Error('fail')
    ;(athleteService.create as jest.Mock).mockRejectedValue(error)
    await athleteController.create(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should call next with UnauthorizedException if no user in create', async () => {
    req.user = undefined
    await athleteController.create(req as Request, res as Response, next)
    expect(next).toHaveBeenCalled()
  })

  it('should update an athlete and return 200', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    req.body = { firstname: 'Updated' }
    ;(athleteService.update as jest.Mock).mockResolvedValue({ ...mockAthlete, firstname: 'Updated' })
    const responseHandlerSpy = jest.spyOn(responseHandlerModule, 'responseHandler')
    await athleteController.update(req as Request, res as Response, next)
    expect(athleteService.update).toHaveBeenCalledWith('athleteId', { firstname: 'Updated' })
    expect(responseHandlerSpy).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, {
      ...mockAthlete,
      firstname: 'Updated',
    })
  })

  it('should call next with NotFoundException if update returns null', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    req.body = { firstname: 'Updated' }
    ;(athleteService.update as jest.Mock).mockResolvedValue(null)
    await athleteController.update(req as Request, res as Response, next)
    expect(next).toHaveBeenCalled()
  })

  it('should call next with error if service throws in update', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    req.body = { firstname: 'Updated' }
    const error = new Error('fail')
    ;(athleteService.update as jest.Mock).mockRejectedValue(error)
    await athleteController.update(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})
