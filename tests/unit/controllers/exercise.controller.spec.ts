import { Request, Response, NextFunction } from 'express'
import exerciseController from '../../../src/controllers/exercise.controller'
import exerciseService from '../../../src/services/exercise.service'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'
import { responseHandler } from '../../../src/handlers/responseHandler'
import ConflictException from '../../../src/exceptions/ConflictException'
import NotFoundException from '../../../src/exceptions/NotFoundException'

jest.mock('../../../src/services/exercise.service')
jest.mock('../../../src/handlers/responseHandler')

describe('exerciseController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe('create', () => {
    it('should create a new exercise if it does not exist', async () => {
      req.body = {
        name: 'Push Up',
        description: 'A basic push-up exercise',
        muscles: ['chest', 'triceps'],
        difficulty: 'easy',
      }
      ;(exerciseService.findOne as jest.Mock).mockResolvedValue(null)
      ;(exerciseService.create as jest.Mock).mockResolvedValue(req.body)

      await exerciseController.create(req as Request, res as Response, next)

      expect(exerciseService.findOne).toHaveBeenCalledWith({ name: 'Push Up' })
      expect(exerciseService.create).toHaveBeenCalledWith(req.body)
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.CREATED, StatusMessage.CREATED, req.body)
    })

    it('should throw ConflictException if the exercise already exists', async () => {
      req.body = { name: 'Push Up' }
      ;(exerciseService.findOne as jest.Mock).mockResolvedValue(req.body)

      await exerciseController.create(req as Request, res as Response, next)

      expect(exerciseService.findOne).toHaveBeenCalledWith({ name: 'Push Up' })
      expect(next).toHaveBeenCalledWith(new ConflictException('The exercise already exists'))
    })
  })

  describe('findById', () => {
    it('should return the exercise if it exists', async () => {
      req.body = { id: '123' }

      const mockExercise = { id: '123', name: 'Push Up' }
      ;(exerciseService.findById as jest.Mock).mockResolvedValue(mockExercise)

      await exerciseController.findById(req as Request, res as Response, next)

      expect(exerciseService.findById).toHaveBeenCalledWith('123')
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockExercise)
    })

    it('should throw NotFoundException if the exercise does not exist', async () => {
      req.body = { id: '123' }
      ;(exerciseService.findById as jest.Mock).mockResolvedValue(null)

      await exerciseController.findById(req as Request, res as Response, next)

      expect(exerciseService.findById).toHaveBeenCalledWith('123')
      expect(next).toHaveBeenCalledWith(new NotFoundException('Exercise with id: 123 not found'))
    })
  })

  describe('findAll', () => {
    it('should return all exercises', async () => {
      const mockExercises = [
        { id: '1', name: 'Push Up' },
        { id: '2', name: 'Pull Up' },
      ]
      ;(exerciseService.findAll as jest.Mock).mockResolvedValue(mockExercises)

      await exerciseController.findAll(req as Request, res as Response, next)

      expect(exerciseService.findAll).toHaveBeenCalled()
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockExercises)
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Database error')
      ;(exerciseService.findAll as jest.Mock).mockRejectedValue(error)

      await exerciseController.findAll(req as Request, res as Response, next)

      expect(exerciseService.findAll).toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
