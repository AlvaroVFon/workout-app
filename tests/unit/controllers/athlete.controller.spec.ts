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

  it('should return athlete by id and coach', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    ;(athleteService.findOne as jest.Mock).mockResolvedValue(mockAthlete)
    const responseHandlerSpy = jest.spyOn(responseHandlerModule, 'responseHandler')
    await athleteController.findOneByCoach(req as Request, res as Response, next)
    expect(athleteService.findOne).toHaveBeenCalledWith({ query: { _id: 'athleteId', coach: mockUser.id } })
    expect(responseHandlerSpy).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockAthlete)
  })

  it('should call next with NotFoundException if athlete not found by id and coach', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    ;(athleteService.findOne as jest.Mock).mockResolvedValue(null)
    await athleteController.findOneByCoach(req as Request, res as Response, next)
    expect(next).toHaveBeenCalled()
  })

  it('should call next with error if service throws in findOneByCoach', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    const error = new Error('fail')
    ;(athleteService.findOne as jest.Mock).mockRejectedValue(error)
    await athleteController.findOneByCoach(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should return all athletes by coach paginated', async () => {
    ;(athleteService.findAll as jest.Mock).mockResolvedValue([mockAthlete])
    ;(athleteService.getTotal as jest.Mock).mockResolvedValue(1)
    const responseHandlerSpy = jest.spyOn(responseHandlerModule, 'responseHandler')
    await athleteController.findAllByCoach(req as Request, res as Response, next)
    expect(athleteService.findAll).toHaveBeenCalled()
    expect(athleteService.getTotal).toHaveBeenCalled()
    expect(responseHandlerSpy).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, expect.anything())
  })

  it('should call next with error if service throws in findAllByCoach', async () => {
    const error = new Error('fail')
    ;(athleteService.findAll as jest.Mock).mockRejectedValue(error)
    await athleteController.findAllByCoach(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should delete athlete and return 204', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    ;(athleteService.delete as jest.Mock).mockResolvedValue(undefined)
    const responseHandlerSpy = jest.spyOn(responseHandlerModule, 'responseHandler')
    await athleteController.delete(req as Request, res as Response, next)
    expect(athleteService.delete).toHaveBeenCalledWith('athleteId')
    expect(responseHandlerSpy).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
  })

  it('should call next with error if service throws in delete', async () => {
    if (!req.params) req.params = {}
    req.params.id = 'athleteId'
    const error = new Error('fail')
    ;(athleteService.delete as jest.Mock).mockRejectedValue(error)
    await athleteController.delete(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})
