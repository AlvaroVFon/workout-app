import { Request, Response, NextFunction } from 'express'
import ConflictException from '../exceptions/ConflictException'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import exerciseService from '../services/exercise.service'
import NotFoundException from '../exceptions/NotFoundException'

class ExerciseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, muscles, difficulty } = req.body

      const exercise = await exerciseService.findOne({ name })
      if (exercise) throw new ConflictException('The exercise already exists')

      const newExercise = await exerciseService.create({
        name,
        description,
        muscles,
        difficulty,
      })

      return responseHandler(res, StatusCode.CREATED, StatusMessage.CREATED, newExercise)
    } catch (error) {
      next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body

    try {
      const exercise = await exerciseService.findById(String(id))
      if (!exercise) throw new NotFoundException(`Exercise with id: ${id} not found`)
    } catch (error) {
      next(error)
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const exercises = await exerciseService.findAll()

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, exercises)
    } catch (error) {
      next(error)
    }
  }
}

export default new ExerciseController()
