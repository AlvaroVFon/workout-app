import { Request, Response, NextFunction, response } from 'express'
import exerciseController from '../../../src/controllers/exercise.controller'
import exerciseService from '../../../src/services/exercise.service'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'
import { responseHandler } from '../../../src/handlers/responseHandler'
import NotFoundException from '../../../src/exceptions/NotFoundException'

jest.mock('../../../src/services/exercise.service')
jest.mock('../../../src/handlers/responseHandler')
jest.mock('../../../src/middlewares/exercise.middleware')

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
      ;(exerciseService.create as jest.Mock).mockResolvedValue(req.body)

      await exerciseController.create(req as Request, res as Response, next)

      expect(exerciseService.create).toHaveBeenCalledWith(req.body)
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.CREATED, StatusMessage.CREATED, req.body)
    })
  })

  describe('findById', () => {
    it('should return the exercise if it exists', async () => {
      req.params = { id: '123' }

      const mockExercise = { id: '123', name: 'Push Up' }
      ;(exerciseService.findById as jest.Mock).mockResolvedValue(mockExercise)

      await exerciseController.findById(req as Request, res as Response, next)

      expect(exerciseService.findById).toHaveBeenCalledWith('123')
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockExercise)
    })

    it('should throw NotFoundException if the exercise does not exist', async () => {
      req.params = { id: '123' }
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

  describe('findByName', () => {
    it('Should return the exercise if it exists', async () => {
      req.body = { name: 'Muscle up' }
      const mockExercise = {
        _id: '1',
        name: 'Muscle up',
        description: 'Best calistenics move',
        difficulty: 'medium',
      }
      ;(exerciseService.findByName as jest.Mock).mockResolvedValue(mockExercise)
      await exerciseController.findByName(req as Request, res as Response, next)

      expect(exerciseService.findByName).toHaveBeenCalledWith('Muscle up')
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, mockExercise)
    })

    it('Should throw NotFoundException if exercise does not exists', async () => {
      req.body = { name: 'Handstand' }
      ;(exerciseService.findByName as jest.Mock).mockResolvedValue(null)

      await exerciseController.findByName(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new NotFoundException('Exercise not found'))
    })
  })

  describe('updateOne', () => {
    it('Should update he exercise if exists', async () => {
      req.params = { id: '123' }
      req.body = { name: 'Back lever' }

      const mockUpdatedExercise = {
        id: 123,
        name: 'Back lever',
      }

      ;(exerciseService.update as jest.Mock).mockResolvedValue({
        mockUpdatedExercise,
      })

      await exerciseController.update(req as Request, res as Response, next)

      expect(next).not.toHaveBeenCalled()
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, expect.any(Object))
    })

    it('Should throw NotFoundException if exercise does not exists', async () => {
      req.params = { id: '123' }
      ;(exerciseService.update as jest.Mock).mockResolvedValue(null)

      await exerciseController.update(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new NotFoundException('Exercise not found'))
    })
  })

  describe('delete', () => {
    it('should delete an exercise if it exists', async () => {
      req.params = { id: '123' }
      const mockedExercise = { id: 123, name: 'delete' }

      ;(exerciseService.delete as jest.Mock).mockResolvedValue(mockedExercise)

      await exerciseController.delete(req as Request, res as Response, next)

      expect(next).not.toHaveBeenCalled()
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    })
    it('should throw NotFoundException if exercise does not exists', async () => {
      req.params = { id: '123' }
      ;(exerciseService.delete as jest.Mock).mockResolvedValue(null)

      await exerciseController.delete(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new NotFoundException('Exercise not found'))
    })
  })
})
