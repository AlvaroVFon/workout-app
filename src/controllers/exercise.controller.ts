import { Request, Response, NextFunction } from 'express'
import { responseHandler } from '../handlers/responseHandler'
import { StatusCode, StatusMessage } from '../utils/enums/httpResponses.enum'
import exerciseService from '../services/exercise.service'
import NotFoundException from '../exceptions/NotFoundException'

class ExerciseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, muscles, difficulty } = req.body

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
    const { id } = req.params

    try {
      const exercise = await exerciseService.findById(String(id))
      if (!exercise) throw new NotFoundException(`Exercise with id: ${id} not found`)

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, exercise)
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

  async findByName(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body

    try {
      const exercise = await exerciseService.findByName(name)
      if (!exercise) throw new NotFoundException('Exercise not found')

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, exercise)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const data = req.body

    try {
      const updatedExercise = await exerciseService.update(String(id), data)
      if (!updatedExercise) throw new NotFoundException('Exercise not found')

      return responseHandler(res, StatusCode.OK, StatusMessage.OK, updatedExercise)
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const deletedExercise = await exerciseService.delete(String(id))
      if (!deletedExercise) throw new NotFoundException('Exercise not found')

      return responseHandler(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    } catch (error) {
      next(error)
    }
  }
}

export default new ExerciseController()
