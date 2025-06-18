import { Request, Response, NextFunction } from 'express'
import muscleController from '../../../src/controllers/muscle.controller'
import muscleService from '../../../src/services/muscle.service'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'
import NotFoundException from '../../../src/exceptions/NotFoundException'

jest.mock('../../../src/services/muscle.service')

describe('MuscleController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new muscle', async () => {
      const mockMuscle = { id: '1', name: 'Biceps' }
      ;(muscleService.create as jest.Mock).mockResolvedValue(mockMuscle)

      await muscleController.create(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(StatusCode.CREATED)
      expect(res.json).toHaveBeenCalledWith({
        message: StatusMessage.CREATED,
        statusCode: StatusCode.CREATED,
        data: mockMuscle,
      })
    })
  })

  describe('findById', () => {
    it('should return a muscle by ID', async () => {
      req = { params: { id: '1' } }
      const mockMuscle = { id: '1', name: 'Biceps' }
      ;(muscleService.findById as jest.Mock).mockResolvedValue(mockMuscle)

      await muscleController.findById(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
      expect(res.json).toHaveBeenCalledWith({
        message: StatusMessage.OK,
        statusCode: StatusCode.OK,
        data: mockMuscle,
      })
    })

    it('should call next with NotFoundException if muscle not found', async () => {
      req = { params: { id: '999' } }
      ;(muscleService.findById as jest.Mock).mockResolvedValue(null)

      await muscleController.findById(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new NotFoundException('Muscle not found'))
    })
  })

  describe('findAll', () => {
    it('should return all muscles', async () => {
      req = {}
      const mockMuscles = [
        { id: '1', name: 'Biceps' },
        { id: '2', name: 'Triceps' },
      ]
      ;(muscleService.findAll as jest.Mock).mockResolvedValue(mockMuscles)

      await muscleController.findAll(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
      expect(res.json).toHaveBeenCalledWith({
        message: StatusMessage.OK,
        statusCode: StatusCode.OK,
        data: mockMuscles,
      })
    })
  })

  describe('update', () => {
    it('should update a muscle', async () => {
      req = { params: { id: '1' }, body: { name: 'Updated Biceps' } }
      const mockUpdatedMuscle = { id: '1', name: 'Updated Biceps' }
      ;(muscleService.update as jest.Mock).mockResolvedValue(mockUpdatedMuscle)

      await muscleController.update(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(StatusCode.OK)
      expect(res.json).toHaveBeenCalledWith({
        message: StatusMessage.OK,
        statusCode: StatusCode.OK,
        data: mockUpdatedMuscle,
      })
    })

    it('should call next with NotFoundException if muscle not found', async () => {
      req = {
        params: { id: '999' },
        body: { name: 'Nonexistent Muscle' },
      }
      ;(muscleService.update as jest.Mock).mockResolvedValue(null)

      await muscleController.update(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new NotFoundException('Muscle not found'))
    })
  })

  describe('delete', () => {
    it('should delete a muscle', async () => {
      req = { params: { id: '1' } }
      const mockDeletedMuscle = { id: '1', name: 'Biceps' }
      ;(muscleService.delete as jest.Mock).mockResolvedValue(mockDeletedMuscle)

      await muscleController.delete(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(StatusCode.NO_CONTENT)
      expect(res.json).toHaveBeenCalledWith({})
    })

    it('should call next with NotFoundException if muscle not found', async () => {
      req = { params: { id: '999' } }
      ;(muscleService.delete as jest.Mock).mockResolvedValue(null)

      await muscleController.delete(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new NotFoundException('Muscle not found'))
    })
  })
})
